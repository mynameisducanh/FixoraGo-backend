import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ActivityLogEntity,
  ActivityType,
} from '../../database/entities/activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';
import { CloudService } from '../../helpers/cloud.helper';
import { HistoryActiveRequestService } from '../historyActiveRequest/historyActiveRequest.service';
import { RevenueManagerService } from '../revenue-manager/revenue-manager.service';
import { generateId } from 'src/utils/function';
import { NotificationService } from '../notification/notification.service';
import {
  NotificationPriority,
  NotificationType,
} from 'src/database/entities/notification.entity';
import { FilterActivityLogDto, TimeSort } from './dto/filter-activity-log.dto';
import { plainToClass } from 'class-transformer';
import { ActivityLogResponse } from './types/activity-log.types';
import { UsersService } from '../users/users.service';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLogEntity)
    private activityLogRepository: Repository<ActivityLogEntity>,
    private readonly cloudService: CloudService,
    private readonly historyActiveRequestService: HistoryActiveRequestService,
    @Inject(forwardRef(() => RevenueManagerService))
    private readonly revenueManagerService: RevenueManagerService,
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async create(
    createActivityLogDto: CreateActivityLogDto,
    file?: Express.Multer.File,
  ): Promise<ActivityLogEntity> {
    let imageUrl = '';
    if (file) {
      imageUrl = await this.cloudService.uploadFileToCloud(file);
    }
    const id = generateId().toLocaleLowerCase();
    const activityLog = this.activityLogRepository.create({
      id: id,
      ...createActivityLogDto,
      imageUrl: imageUrl || createActivityLogDto.imageUrl,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
    });
    let dataHistory;

    if (createActivityLogDto.activityType === 'staff_checkin') {
      dataHistory = {
        requestServiceId: createActivityLogDto.requestServiceId,
        name: 'Nhân viên đã đánh dấu là đã tới , đang chờ xác nhận từ khách hàng',
        type: 'Thông báo từ nhân viên',
      };
      await this.historyActiveRequestService.create(dataHistory);
    }
    if (
      createActivityLogDto.activityType === 'user_report' ||
      createActivityLogDto.activityType === 'fixer_report'
    ) {
      dataHistory = {
        requestServiceId: createActivityLogDto.requestServiceId,
        name: 'Chúng tôi đã nhận được báo cáo từ bạn.Chúng tôi sẽ xem xét và phản hồi sớm nhất có thể',
        type: 'Báo cáo người dùng thành công',
      };
      await this.historyActiveRequestService.create(dataHistory);
    }
    if (createActivityLogDto.activityType === 'staff_payfee') {
      const dataRevenue = {
        userId: createActivityLogDto.userId,
        paidFees: Number(createActivityLogDto.note),
        status: 'UnConfirm',
        temp: 'staff_payfee',
        activityId: id,
        createAt: new Date().getTime(),
        updateAt: new Date().getTime(),
      };
      await this.revenueManagerService.create(dataRevenue);
      await this.notificationService.create({
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.MEDIUM,
        title: 'Gửi yêu cầu thành công',
        content: `Chúng tôi đã nhận được yêu cầu và bill nộp phí của bạn, chúng thôi sẽ xác nhận và thông báo tới bạn sớm nhất`,
        userId: createActivityLogDto.userId,
      });
    }
    return await this.activityLogRepository.save(activityLog);
  }

  async findAll(): Promise<ActivityLogEntity[]> {
    return await this.activityLogRepository.find();
  }

  async getAllByFilter(
    filter: FilterActivityLogDto,
  ): Promise<ActivityLogEntity[]> {
    const queryBuilder =
      this.activityLogRepository.createQueryBuilder('activityLogs');

    if (filter.type === 'report') {
      queryBuilder.where('activityLogs.activityType IN (:...reportTypes)', {
        reportTypes: ['user_report', 'fixer_report'],
      });
    }

    queryBuilder.andWhere('activityLogs.activityType != :excludeType', {
      excludeType: 'staff_payfee',
    });

    if (filter.activityType) {
      queryBuilder.where('activityLogs.activityType = :activityType', {
        activityType: filter.activityType,
      });
    }
    // Sort by time
    if (filter.sortTime === TimeSort.NEWEST) {
      queryBuilder.orderBy('activityLogs.CreateAt', 'DESC');
    } else if (filter.sortTime === TimeSort.OLDEST) {
      queryBuilder.orderBy('activityLogs.CreateAt', 'ASC');
    } else {
      // Default order
      queryBuilder.orderBy('activityLogs.CreateAt', 'DESC');
    }
    queryBuilder.addSelect([
      'activityLogs.id AS id',
      'activityLogs.activityType AS activitytype',
      'activityLogs.fixerId AS fixerid',
      'activityLogs.userId AS userid',
      'activityLogs.requestServiceId AS requestserviceid',
      'activityLogs.requestConfirmId AS requestconfirmid',
      'activityLogs.note AS note',
      'activityLogs.imageUrl AS imageurl',
      'activityLogs.address AS address',
      'activityLogs.note AS note',
      'activityLogs.temp AS temp',
      'activityLogs.DeleteAt AS deleteAt',
      'activityLogs.CreateAt AS createAt',
      'activityLogs.temp AS temp',
    ]);
    const result = await queryBuilder.getRawMany();
    const items = plainToClass(ActivityLogResponse, result, {
      excludeExtraneousValues: true,
    });
    const billsWithUserInfo = await Promise.all(
      items.map(async (item) => {
        let userInfo = null;
        let fixerInfo = null;

        if (item.userId) {
          userInfo = await this.usersService.getUserByUserId2(item.userId);
        }
        if (item.fixerId) {
          fixerInfo = await this.usersService.getUserByUserId2(item.fixerId);
        }

        return {
          ...item,
          user: userInfo
            ? {
                fullName: `${userInfo.firstName} ${userInfo.lastName}`,
                username: userInfo.username,
                email: userInfo.email,
                avatarUrl: userInfo.avatarUrl,
              }
            : null,
          fixer: fixerInfo
            ? {
                fullName: `${fixerInfo.firstName} ${fixerInfo.lastName}`,
                username: fixerInfo.username,
                email: fixerInfo.email,
                avatarUrl: fixerInfo.avatarUrl,
              }
            : null,
        };
      }),
    );
    return billsWithUserInfo;
  }

  async findOne(id: string): Promise<ActivityLogEntity> {
    const activityLog = await this.activityLogRepository.findOne({
      where: { id },
    });
    if (!activityLog) {
      throw new NotFoundException(`Activity log with ID ${id} not found`);
    }
    return activityLog;
  }

  async update(
    id: string,
    updateActivityLogDto: UpdateActivityLogDto,
    file?: Express.Multer.File,
  ): Promise<ActivityLogEntity> {
    const activityLog = await this.findOne(id);

    if (file) {
      if (activityLog.imageUrl) {
        await this.cloudService.deleteFileByUrl(activityLog.imageUrl, 'image');
      }
      const imageUrl = await this.cloudService.uploadFileToCloud(file);
      updateActivityLogDto.imageUrl = imageUrl;
    }

    Object.assign(activityLog, updateActivityLogDto);
    return await this.activityLogRepository.save(activityLog);
  }

  async remove(id: string): Promise<void> {
    const activityLog = await this.findOne(id);
    if (activityLog.imageUrl) {
      await this.cloudService.deleteFileByUrl(activityLog.imageUrl, 'image');
    }
    await this.activityLogRepository.remove(activityLog);
  }

  async findByRequestServiceId(
    requestServiceId: string,
  ): Promise<ActivityLogEntity[]> {
    return await this.activityLogRepository.find({
      where: { requestServiceId },
      order: { createAt: 'DESC' },
    });
  }

  async checkFixerCheckin(
    requestServiceId: string,
  ): Promise<{ hasCheckin: boolean; fixerId?: string }> {
    const activityLog = await this.activityLogRepository.findOne({
      where: {
        requestServiceId,
        activityType: ActivityType.STAFF_CHECKIN,
      },
      order: { createAt: 'DESC' },
    });
    if (activityLog && activityLog.fixerId) {
      return {
        hasCheckin: true,
        fixerId: activityLog.fixerId,
      };
    }

    return {
      hasCheckin: false,
    };
  }
  async checkUserConfirmCheckin(
    requestServiceId: string,
  ): Promise<{ hasCheckin: boolean; userId?: string }> {
    const activityLog = await this.activityLogRepository.findOne({
      where: {
        requestServiceId,
        activityType: ActivityType.STAFF_CHECKIN,
      },
      order: { createAt: 'DESC' },
    });
    if (
      activityLog &&
      activityLog.fixerId &&
      activityLog.temp === 'user_confirmed'
    ) {
      return {
        hasCheckin: true,
        userId: activityLog.userId,
      };
    }

    return {
      hasCheckin: false,
    };
  }
  async findAllStaffPayfee(userId?: string): Promise<ActivityLogEntity[]> {
    const whereCondition: any = {
      activityType: ActivityType.STAFF_PAYFEE,
    };

    if (userId) {
      whereCondition.userId = userId;
    }

    return await this.activityLogRepository.find({
      where: whereCondition,
      order: { createAt: 'DESC' },
    });
  }

  async findAllUserReport(userId?: string): Promise<ActivityLogEntity[]> {
    const whereCondition: any = {
      activityType: ActivityType.USER_REPORT,
    };

    if (userId) {
      whereCondition.userId = userId;
    }

    return await this.activityLogRepository.find({
      where: whereCondition,
      order: { createAt: 'DESC' },
    });
  }
  async findAllStaffReport(fixerId?: string): Promise<ActivityLogEntity[]> {
    const whereCondition: any = {
      activityType: ActivityType.STAFF_REPORT,
    };

    if (fixerId) {
      whereCondition.fixerId = fixerId;
    }

    return await this.activityLogRepository.find({
      where: whereCondition,
      order: { createAt: 'DESC' },
    });
  }
  async updateTemp(id: string, temp: string): Promise<ActivityLogEntity> {
    const activityLog = await this.findOne(id);
    activityLog.temp = temp;
    activityLog.updateAt = new Date().getTime();
    return await this.activityLogRepository.save(activityLog);
  }

  async findByRequestServiceIdAndStaffCheckin(
    requestServiceId: string,
  ): Promise<ActivityLogEntity> {
    return await this.activityLogRepository.findOne({
      where: {
        requestServiceId,
        activityType: ActivityType.STAFF_CHECKIN,
      },
      order: { createAt: 'DESC' },
    });
  }

  async updateTempAndTimestamp(
    id: string,
    temp: string,
  ): Promise<ActivityLogEntity> {
    const activityLog = await this.findOne(id);
    activityLog.temp = temp;
    activityLog.updateAt = new Date().getTime();
    const dataHistory = {
      requestServiceId: activityLog.requestServiceId,
      name: 'Khách hàng đã xác nhận là nhân viên đã tới',
      type: 'Thông báo từ khách hàng',
    };
    await this.historyActiveRequestService.create(dataHistory);
    return await this.activityLogRepository.save(activityLog);
  }
}
