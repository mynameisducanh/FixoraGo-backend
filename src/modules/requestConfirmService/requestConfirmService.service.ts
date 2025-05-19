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

@Injectable()
export class RequestConfirmServiceService {
  constructor(
    @InjectRepository(RequestConfirmServiceEntity)
    private readonly requestConfirmServiceRes: Repository<RequestConfirmServiceEntity>,
    @InjectRepository(RequestServiceEntity)
    private readonly requestServiceRes: Repository<RequestServiceEntity>,
    private readonly cloudService: CloudService,
    private readonly historyActiveRequestService: HistoryActiveRequestService,
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
    }

    return {
      message: 'Tạo request confirm service thành công',
      statusCode: HttpStatus.OK,
      id: savedService.id,
    };
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
      }
      if (service.type === 'completed') {
        dataHistory = {
          requestServiceId: service.requestServiceId,
          name: 'Khách hàng đã xác nhận là nhân viên đã hoàn thành',
          type: 'Khách hàng đã xác nhận',
        };
        await this.historyActiveRequestService.create(dataHistory);

        if (service.temp) {
          const warrantyDays = parseInt(service.temp);
          const currentTime = new Date().getTime();
          const guaranteeTime = new Date(currentTime + warrantyDays * 24 * 60 * 60 * 1000).getTime().toString();
          
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
}
