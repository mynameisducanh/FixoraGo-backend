import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateRequestConfirmServiceDto } from './dto/create-request-confirm-service.dto';
import { UpdateRequestConfirmServiceDto } from './dto/update-request-confirm-service.dto';
import { MessageResponse } from 'src/common/types/response';
import { plainToClass } from 'class-transformer';
import {
  RequestConfirmServiceEntity,
  ServiceType,
} from 'src/database/entities/request-confirm-service.entity';
import { RequestConfirmServiceResponse } from './types/requestConfirmService.types';
import { CloudService } from 'src/helpers/cloud.helper';
import { HistoryActiveRequestService } from 'src/modules/historyActiveRequest/historyActiveRequest.service';
import { RequestServiceEntity } from 'src/database/entities/request-service.entity';
import { ServiceStatus } from 'src/database/entities/request-service.entity';
import { RevenueManagerService } from '../revenue-manager/revenue-manager.service';
import { UsersService } from 'src/modules/users/users.service';
import { NotificationService } from 'src/modules/notification/notification.service';
import {
  NotificationPriority,
  NotificationType,
} from 'src/database/entities/notification.entity';
import { RequestServiceService } from 'src/modules/requestService/requestService.service';

@Injectable()
export class RequestConfirmServiceService {
  constructor(
    @InjectRepository(RequestConfirmServiceEntity)
    private readonly requestConfirmServiceRes: Repository<RequestConfirmServiceEntity>,
    @InjectRepository(RequestServiceEntity)
    private readonly requestServiceRes: Repository<RequestServiceEntity>,
    private readonly cloudService: CloudService,
    private readonly historyActiveRequestService: HistoryActiveRequestService,
    private readonly revenueManagerService: RevenueManagerService,
    private readonly userService: UsersService,
    private readonly notificationService: NotificationService,
    private readonly requestServiceService: RequestServiceService,
  ) {}

  async save(
    service: DeepPartial<RequestConfirmServiceEntity>,
  ): Promise<RequestConfirmServiceEntity> {
    return await this.requestConfirmServiceRes.save(service);
  }

  async createRequestConfirmService(
    body: CreateRequestConfirmServiceDto,
    file: Express.Multer.File,
  ): Promise<MessageResponse & { id?: string }> {
    try {
      let imageUrl = '';
      if (file) {
        imageUrl = await this.cloudService.uploadFileToCloud(file);
      }

      const newService: DeepPartial<RequestConfirmServiceEntity> = {
        userId: body.userId,
        requestServiceId: body.requestServiceId,
        name: body.name,
        type: body.type,
        price: body.price,
        userAccept: null,
        image: imageUrl,
        note: body.note,
        temp: body.temp,
        createAt: new Date().getTime(),
        updateAt: new Date().getTime(),
      };
      const res = await this.requestServiceService.getOneById(
        body.requestServiceId,
      );
      const savedService = await this.requestConfirmServiceRes.save(newService);
      let dataHistory;
      if (body.type === ServiceType.REPAIR) {
        dataHistory = {
          requestServiceId: body.requestServiceId,
          name: 'Nhân viên đã đề xuất các sửa chữa cho thiết bị của khách hàng',
          type: 'Đề xuất từ nhân viên',
        };
        await this.historyActiveRequestService.create(dataHistory);
      }
      if (body.type === ServiceType.COMPLETED) {
        dataHistory = {
          requestServiceId: body.requestServiceId,
          name: 'Nhân viên đã đánh dấu là đã hoàn thành, đang chờ khách hàng xác nhận',
          type: 'Thông báo hoàn thành từ nhân viên',
        };
        await this.historyActiveRequestService.create(dataHistory);
          await this.notificationService.create({
            type: NotificationType.SYSTEM,
            priority: NotificationPriority.MEDIUM,
            title: `Thông báo từ yêu cầu ${body.requestServiceId.slice(0, 13)}`,
            content: `Nhân viên đã đánh dấu là đã hoàn thành, vui lòng xác nhận`,
            userId: res.userId,
            actionUrl: `/requestService/detail`,
            metadata: `${body.requestServiceId}`,
          });
      }

      return {
        message: 'Tạo request confirm service thành công',
        statusCode: HttpStatus.OK,
        id: savedService.id,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getOneById(id: string): Promise<RequestConfirmServiceResponse> {
    try {
      const queryResult = await this.requestConfirmServiceRes
        .createQueryBuilder('requestConfirmServices')
        .andWhere('requestConfirmServices.id = :id', { id: id })
        .addSelect([
          'requestConfirmServices.id AS id',
          'requestConfirmServices.requestConfirmId AS requestConfirmId',
          'requestConfirmServices.name AS name',
          'requestConfirmServices.userAccept AS userAccept',
          'requestConfirmServices.type AS type',
          'requestConfirmServices.price AS price',
          'requestConfirmServices.image AS image',
          'requestConfirmServices.note AS note',
          'requestConfirmServices.temp AS temp',
          'requestConfirmServices.createAt AS createAt',
          'requestConfirmServices.updateAt AS updateAt',
        ])
        .getRawOne();

      if (!queryResult) {
        throw new NotFoundException(
          `Request confirm service with ID ${id} not found`,
        );
      }

      return plainToClass(RequestConfirmServiceResponse, queryResult, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async getByRequestConfirmId(
    requestServiceId: string,
    type: string,
  ): Promise<RequestConfirmServiceResponse[]> {
    try {
      const queryBuilder = this.requestConfirmServiceRes
        .createQueryBuilder('requestConfirmServices')
        .andWhere(
          'requestConfirmServices.requestServiceId = :requestServiceId',
          {
            requestServiceId: requestServiceId,
          },
        )
        .addSelect([
          'requestConfirmServices.id AS id',
          'requestConfirmServices.requestServiceId AS requestServiceId',
          'requestConfirmServices.name AS name',
          'requestConfirmServices.userId AS userId',
          'requestConfirmServices.userAccept AS useraccept',
          'requestConfirmServices.type AS type',
          'requestConfirmServices.price AS price',
          'requestConfirmServices.image AS image',
          'requestConfirmServices.note AS note',
          'requestConfirmServices.temp AS temp',
          'requestConfirmServices.createAt AS createAt',
          'requestConfirmServices.updateAt AS updateAt',
        ]);
      if (type === 'total') {
        queryBuilder
          .andWhere('requestConfirmServices.type = :type', { type })
          .orderBy('requestConfirmServices.createAt', 'DESC')
          .limit(1);
      } else if (type === 'repair') {
        queryBuilder.andWhere('requestConfirmServices.type IN (:...types)', {
          types: ['repair', 'replace'],
        });
      } else {
        queryBuilder.andWhere('requestConfirmServices.type = :type', { type });
      }

      const queryResult = await queryBuilder.getRawMany();

      return plainToClass(RequestConfirmServiceResponse, queryResult, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateRequestConfirmService(
    id: string,
    body: UpdateRequestConfirmServiceDto,
    file: Express.Multer.File,
  ): Promise<MessageResponse> {
    try {
      const service = await this.requestConfirmServiceRes.findOne({
        where: { id: id },
      });

      if (!service) {
        throw new NotFoundException(
          `Request confirm service with ID ${id} not found`,
        );
      }

      const updateData: DeepPartial<RequestConfirmServiceEntity> = {
        name: body.name,
        price: body.price?.toString(),
        note: body.note,
        updateAt: new Date().getTime(),
      };

      if (file) {
        if (service.image) {
          await this.cloudService.deleteFileByUrl(service.image, 'image');
        }
        const imageUrl = await this.cloudService.uploadFileToCloud(file);
        updateData.image = imageUrl;
      }

      await this.requestConfirmServiceRes.update(id, updateData);

      return {
        message: 'Cập nhật request confirm service thành công',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteRequestConfirmService(id: string): Promise<MessageResponse> {
    try {
      const service = await this.requestConfirmServiceRes.findOne({
        where: { id: id },
      });

      if (!service) {
        throw new NotFoundException(
          `Request confirm service with ID ${id} not found`,
        );
      }

      if (service.image) {
        await this.cloudService.deleteFileByUrl(service.image, 'image');
      }

      await this.requestConfirmServiceRes.delete(id);

      return {
        message: 'Xóa request confirm service thành công',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async userAccept(id: string): Promise<MessageResponse> {
    try {
      const service = await this.requestConfirmServiceRes.findOne({
        where: { id: id },
      });

      if (!service) {
        throw new NotFoundException(
          `Request confirm service with ID ${id} not found`,
        );
      }
      let dataHistory;
      const res = await this.requestServiceService.getOneById(
        service.requestServiceId,
      );
      if (service.type === 'repair') {
        dataHistory = {
          requestServiceId: service.requestServiceId,
          name: 'Bạn đã xác nhận là đồng ý với đề xuất của nhân viên',
          type: 'Bạn đã đồng ý với đề xuất',
        };
        await this.historyActiveRequestService.create(dataHistory);
      }
      if (service.type === 'total') {
        dataHistory = {
          requestServiceId: service.requestServiceId,
          name: 'Khách hàng đã xác nhận là đồng ý với đề xuất của nhân viên',
          type: 'Khách hàng đã đồng ý với đề xuất',
        };
        await this.historyActiveRequestService.create(dataHistory);
        if (res.fixerId) {
          await this.notificationService.create({
            type: NotificationType.SYSTEM,
            priority: NotificationPriority.MEDIUM,
            title: `yêu cầu ${service.requestServiceId.slice(0, 13)} đã được chấp nhận`,
            content: `Khách hàng đã đồng ý với đề xuất của bạn, hãy bắt đầu công việc sửa chữa thiết bị`,
            userId: res.fixerId,
            actionUrl: `/requestService/detail`,
            metadata: `${service.requestServiceId}`,
          });
        }
      }
      if (service.type === 'completed') {
        dataHistory = {
          requestServiceId: service.requestServiceId,
          name: 'Khách hàng đã xác nhận là nhân viên đã hoàn thành',
          type: 'Khách hàng đã xác nhận',
        };
        await this.historyActiveRequestService.create(dataHistory);
        const temp = await this.userService.findById(service.userId);
        temp.lastCheckIn = (temp.lastCheckIn || 0) + 1;
        await this.userService.save(temp);
        if (service.temp) {
          const warrantyDays = parseInt(service.temp);
          const currentTime = new Date().getTime();
          const guaranteeTime = new Date(
            currentTime + warrantyDays * 24 * 60 * 60 * 1000,
          )
            .getTime()
            .toString();

          const requestService = await this.requestServiceRes.findOne({
            where: { id: service.requestServiceId },
          });
          if (requestService) {
            requestService.status = ServiceStatus.GUARANTEE;
            requestService.guaranteeTime = guaranteeTime;
            requestService.updateAt = new Date().getTime();
            await this.requestServiceRes.save(requestService);
          }
        }
        if (service.userId) {
          await this.notificationService.create({
            type: NotificationType.SYSTEM,
            priority: NotificationPriority.MEDIUM,
            title: `yêu cầu ${service.requestServiceId.slice(0, 13)} đã được hoàn tất`,
            content: `Thiết bị của bạn sẽ được bảo hành theo số ngày bạn đã trao đổi, trong thời gian này bạn vẫn có thể liên lạc với nhân viên nếu có vấn đề,ngoài ra nếu bạn cần hỗ trợ hãy gọi tới số 0835363526`,
            userId: service.userId,
            actionUrl: `/requestService/detail`,
            metadata: `${service.requestServiceId}`,
          });
        }
        if (res.fixerId) {
          await this.notificationService.create({
            type: NotificationType.SYSTEM,
            priority: NotificationPriority.MEDIUM,
            title: `yêu cầu ${service.requestServiceId.slice(0, 13)} đã được hoàn tất`,
            content: `Cảm ơn vì sự nỗ lực của bạn, trong thời gian này bạn vãn bảo hành cho người dùng trong thời gian đã định`,
            userId: res.fixerId,
            actionUrl: `/requestService/detail`,
            metadata: `${service.requestServiceId}`,
          });
        }
        const createData = {
          userId: service.userId,
          totalRevenue: Number(service.price),
          unpaidFees: Number(service.price) * 0.1,
          status: 'active',
          temp: 'bill',
          createAt: new Date().getTime(),
          updateAt: new Date().getTime(),
        };
        await this.revenueManagerService.create(createData);
        await this.revenueManagerService.incrementTotalRevenue(
          service.userId + '_total',
          Number(service.price),
        );
        await this.revenueManagerService.updateUnpaidFeesWithOperation(
          service.userId + '_total',
          Number(service.price) * 0.1,
          'add',
        );
      }

      await this.requestConfirmServiceRes.update(id, {
        userAccept: 'Accepted',
        updateAt: new Date().getTime(),
      });

      return {
        message: 'Cập nhật trạng thái chấp nhận thành công',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async checkFixerCompleted(
    id: string,
  ): Promise<{ hasCompleted: boolean; fixerId?: string }> {
    const activityLog = await this.requestConfirmServiceRes.findOne({
      where: {
        requestServiceId: id,
        type: ServiceType.COMPLETED,
      },
      order: { createAt: 'DESC' },
    });
    if (activityLog && activityLog.userId) {
      return {
        hasCompleted: true,
        fixerId: activityLog.userId,
      };
    }

    return {
      hasCompleted: false,
    };
  }

  async checkFixerPropose(
    id: string,
  ): Promise<{ hasCompleted: boolean; fixerId?: string }> {
    const activityLog = await this.requestConfirmServiceRes.findOne({
      where: {
        requestServiceId: id,
        type: ServiceType.TOTAL,
      },
      order: { createAt: 'DESC' },
    });
    if (activityLog && activityLog.userId) {
      return {
        hasCompleted: true,
        fixerId: activityLog.userId,
      };
    }

    return {
      hasCompleted: false,
    };
  }

  // Revenue statistics methods
  async getUserRevenueStatistics(userId: string) {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    ).getTime();
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getTime();

    // Get total revenue from all time
    const totalRevenue = await this.requestConfirmServiceRes
      .createQueryBuilder('requestConfirmServices')
      .select('SUM(CAST(requestConfirmServices.price AS DECIMAL))', 'total')
      .where('requestConfirmServices.type = :type', { type: ServiceType.TOTAL })
      .andWhere('requestConfirmServices.userId = :userId', { userId })
      .getRawOne();

    // Get current month revenue
    const currentMonthRevenue = await this.requestConfirmServiceRes
      .createQueryBuilder('requestConfirmServices')
      .select('SUM(CAST(requestConfirmServices.price AS DECIMAL))', 'total')
      .where('requestConfirmServices.type = :type', { type: ServiceType.TOTAL })
      .andWhere('requestConfirmServices.userId = :userId', { userId })
      .andWhere(
        'requestConfirmServices.createAt BETWEEN :startOfMonth AND :endOfMonth',
        {
          startOfMonth,
          endOfMonth,
        },
      )
      .getRawOne();

    // Calculate 10% fee for current month
    const currentMonthFee = currentMonthRevenue?.total
      ? Math.floor(parseFloat(currentMonthRevenue.total) * 0.1)
      : 0;

    return {
      totalRevenue: totalRevenue?.total ? parseFloat(totalRevenue.total) : 0,
      currentMonthRevenue: currentMonthRevenue?.total
        ? parseFloat(currentMonthRevenue.total)
        : 0,
      currentMonthFee,
    };
  }

  async getUserMonthlyRevenue(userId: string) {
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = [];

    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(currentYear, month, 1).getTime();
      const endOfMonth = new Date(currentYear, month + 1, 0).getTime();

      const revenue = await this.requestConfirmServiceRes
        .createQueryBuilder('requestConfirmServices')
        .select('SUM(CAST(requestConfirmServices.price AS DECIMAL))', 'total')
        .where('requestConfirmServices.type = :type', {
          type: ServiceType.TOTAL,
        })
        .andWhere('requestConfirmServices.userId = :userId', { userId })
        .andWhere(
          'requestConfirmServices.createAt BETWEEN :startOfMonth AND :endOfMonth',
          {
            startOfMonth,
            endOfMonth,
          },
        )
        .getRawOne();

      monthlyRevenue.push({
        month: month + 1,
        revenue: revenue?.total ? parseFloat(revenue.total) : 0,
      });
    }

    return monthlyRevenue;
  }

  async getTotalRevenue() {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    ).getTime();
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getTime();

    // Get total revenue from all time
    const totalRevenue = await this.requestConfirmServiceRes
      .createQueryBuilder('requestConfirmServices')
      .select('SUM(CAST(requestConfirmServices.price AS DECIMAL))', 'total')
      .where('requestConfirmServices.type = :type', { type: ServiceType.TOTAL })
      .getRawOne();

    // Get current month revenue
    const currentMonthRevenue = await this.requestConfirmServiceRes
      .createQueryBuilder('requestConfirmServices')
      .select('SUM(CAST(requestConfirmServices.price AS DECIMAL))', 'total')
      .where('requestConfirmServices.type = :type', { type: ServiceType.TOTAL })
      .andWhere(
        'requestConfirmServices.createAt BETWEEN :startOfMonth AND :endOfMonth',
        {
          startOfMonth,
          endOfMonth,
        },
      )
      .getRawOne();

    return {
      totalRevenue: totalRevenue?.total ? parseFloat(totalRevenue.total) : 0,
      currentMonthRevenue: currentMonthRevenue?.total
        ? parseFloat(currentMonthRevenue.total)
        : 0,
    };
  }

  async getYearlyRevenue() {
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = [];

    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(currentYear, month, 1).getTime();
      const endOfMonth = new Date(currentYear, month + 1, 0).getTime();

      const revenue = await this.requestConfirmServiceRes
        .createQueryBuilder('requestConfirmServices')
        .select('SUM(CAST(requestConfirmServices.price AS DECIMAL))', 'total')
        .where('requestConfirmServices.type = :type', {
          type: ServiceType.TOTAL,
        })
        .andWhere(
          'requestConfirmServices.createAt BETWEEN :startOfMonth AND :endOfMonth',
          {
            startOfMonth,
            endOfMonth,
          },
        )
        .getRawOne();

      monthlyRevenue.push({
        month: month + 1,
        revenue: revenue?.total ? parseFloat(revenue.total) : 0,
      });
    }

    const totalYearlyRevenue = monthlyRevenue.reduce(
      (sum, month) => sum + month.revenue,
      0,
    );

    return {
      totalYearlyRevenue,
      monthlyRevenue,
    };
  }

  async checkTotalTypeByRequestServiceId(
    requestServiceId: string,
  ): Promise<{ hasTotalType: boolean; isAccepted: boolean }> {
    const service = await this.requestConfirmServiceRes.findOne({
      where: {
        requestServiceId: requestServiceId,
        type: ServiceType.TOTAL,
      },
    });

    return {
      hasTotalType: !!service,
      isAccepted: service?.userAccept === 'Accepted',
    };
  }
}
