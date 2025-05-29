import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLogEntity)
    private activityLogRepository: Repository<ActivityLogEntity>,
    private readonly cloudService: CloudService,
    private readonly historyActiveRequestService: HistoryActiveRequestService,
    private readonly revenueManagerService: RevenueManagerService,
    private readonly notificationService: NotificationService,
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
    });
    let dataHistory;

    if (createActivityLogDto.activityType === 'staff_checkin') {
      dataHistory = {
        requestServiceId: createActivityLogDto.requestServiceId,
        name: 'Nhân viên đã đánh dấu là đã tới',
        type: 'Thông báo từ nhân viên',
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
}
