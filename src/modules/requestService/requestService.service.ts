import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateRequestServiceDto } from 'src/modules/requestService/dto/create-request-service.dto';
import { MessageResponse } from 'src/common/types/response';
import { plainToClass } from 'class-transformer';
import {
  RequestServiceEntity,
  ServiceStatus,
} from 'src/database/entities/request-service.entity';
import { RequestServiceResponse } from 'src/modules/requestService/types/requestService.types';
import { GetAllRequestServiceDto } from 'src/modules/requestService/dto/get-all-request-service.dto';
import { CloudService } from 'src/helpers/cloud.helper';
import {
  FilterRequestServiceDto,
  TimeSort,
} from './dto/filter-request-service.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class RequestServiceService {
  constructor(
    private readonly cloudService: CloudService,
    @InjectRepository(RequestServiceEntity)
    private readonly requestServiceRes: Repository<RequestServiceEntity>,
    private readonly userService: UsersService,
  ) {}

  async save(
    service: DeepPartial<RequestServiceEntity>,
  ): Promise<RequestServiceEntity> {
    return await this.requestServiceRes.save(service);
  }
  async updateRequest(
    requestService: DeepPartial<RequestServiceEntity>[],
  ): Promise<void> {
    await this.requestServiceRes.save(requestService);
  }
  async createRequestService(
    body: any,
    files: Express.Multer.File[],
  ): Promise<MessageResponse> {
    let fileUrl;
    if (files && files.length > 0) {
      fileUrl = await this.cloudService.uploadFilesToCloud(files);
    }
    const newFileRecord: DeepPartial<RequestServiceEntity> = {
      userId: body.userId,
      fixerId: null,
      nameService: body.nameService,
      listDetailService: body.listDetailService,
      priceService: body.priceService,
      typeEquipment: body.typeEquipment,
      calender: body.calender,
      address: body.address,
      fileImage: JSON.stringify(fileUrl),
      note: body.note,
      status: ServiceStatus.PENDING,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
    };
    this.requestServiceRes.save(newFileRecord);
    return {
      message: 'Tạo request service thành công',
      statusCode: HttpStatus.OK,
    };
  }

  async getAll(): Promise<RequestServiceResponse[]> {
    try {
      const queryResult =
        this.requestServiceRes.createQueryBuilder('requestServices');

      const data = queryResult
        .orderBy('requestServices.UpdateAt', 'ASC')
        .addOrderBy('requestServices.CreateAt', 'ASC')
        .addSelect([
          'requestServices.id AS id',
          'requestServices.userId AS userId',
          'requestServices.fixerId AS fixerId',
          'requestServices.CreateAt AS createAt',
          'requestServices.UpdateAt AS updateAt',
          'requestServices.NameService AS nameService',
          'requestServices.ListDetailService AS listDetailService',
          'requestServices.PriceService AS priceService',
          'requestServices.TypeEquipment AS typeEquipment',
          'requestServices.Note AS note',
          'requestServices.FileImage AS fileImage',
          'requestServices.Address AS address',
          'requestServices.Calender AS calender',
          'requestServices.Status AS status',
        ]);

      const result = await data.getRawMany();
      const items = plainToClass(RequestServiceResponse, result, {
        excludeExtraneousValues: true,
      });
      return items;
    } catch (error) {}
  }

  async getAllByUserId(id: string): Promise<RequestServiceResponse[]> {
    try {
      const queryResult =
        this.requestServiceRes.createQueryBuilder('requestServices');

      console.log(id);
      queryResult.where('requestServices.userId = :userId', {
        userId: id,
      });

      const data = queryResult
        .orderBy('requestServices.UpdateAt', 'ASC')
        .addOrderBy('requestServices.CreateAt', 'ASC')
        .where('requestServices.userId = :userId', { userId: id })
        .addSelect([
          'requestServices.id AS id',
          'requestServices.userId AS userId',
          'requestServices.fixerId AS fixerId',
          'requestServices.CreateAt AS createAt',
          'requestServices.UpdateAt AS updateAt',
          'requestServices.NameService AS nameService',
          'requestServices.ListDetailService AS listDetailService',
          'requestServices.PriceService AS priceService',
          'requestServices.TypeEquipment AS typeEquipment',
          'requestServices.Note AS note',
          'requestServices.FileImage AS fileImage',
          'requestServices.Address AS address',
          'requestServices.Calender AS calender',
          'requestServices.Status AS status',
        ]);

      const result = await data.getRawMany();
      const items = plainToClass(RequestServiceResponse, result, {
        excludeExtraneousValues: true,
      });
      return items;
    } catch (error) {}
  }

  async getAllByFixerId(id: string): Promise<RequestServiceResponse[]> {
    try {
      const queryResult =
        this.requestServiceRes.createQueryBuilder('requestServices');

      console.log(id);
      queryResult.where('requestServices.fixerId = :fixerId', {
        fixerId: id,
      });

      const data = queryResult
        .orderBy('requestServices.UpdateAt', 'ASC')
        .addOrderBy('requestServices.CreateAt', 'ASC')
        .where('requestServices.userId = :userId', { userId: id })
        .addSelect([
          'requestServices.id AS id',
          'requestServices.userId AS userId',
          'requestServices.fixerId AS fixerId',
          'requestServices.CreateAt AS createAt',
          'requestServices.UpdateAt AS updateAt',
          'requestServices.NameService AS nameService',
          'requestServices.ListDetailService AS listDetailService',
          'requestServices.PriceService AS priceService',
          'requestServices.TypeEquipment AS typeEquipment',
          'requestServices.Note AS note',
          'requestServices.FileImage AS fileImage',
          'requestServices.Address AS address',
          'requestServices.Calender AS calender',
          'requestServices.Status AS status',
        ]);

      const result = await data.getRawMany();
      const items = plainToClass(RequestServiceResponse, result, {
        excludeExtraneousValues: true,
      });
      return items;
    } catch (error) {}
  }

  async getAllPendingOrRejected(
    filter: FilterRequestServiceDto,
  ): Promise<RequestServiceResponse[]> {
    const queryBuilder =
      this.requestServiceRes.createQueryBuilder('requestServices');

    queryBuilder.where('requestServices.status IN (:...statuses)', {
      statuses: [ServiceStatus.PENDING, ServiceStatus.REJECTED],
    });

    // Lọc theo tên dịch vụ nếu có
    if (filter.nameService) {
      queryBuilder.andWhere('requestServices.nameService ILIKE :nameService', {
        nameService: `%${filter.nameService}%`,
      });
    }

    // Sắp xếp theo thời gian
    if (filter.sortTime === TimeSort.NEWEST) {
      queryBuilder.orderBy('requestServices.CreateAt', 'DESC');
    } else if (filter.sortTime === TimeSort.OLDEST) {
      queryBuilder.orderBy('requestServices.CreateAt', 'ASC');
    } else {
      // Default order
      queryBuilder.orderBy('requestServices.CreateAt', 'DESC');
    }

    queryBuilder.addSelect([
      'requestServices.id AS id',
      'requestServices.userId AS userId',
      'requestServices.fixerId AS fixerId',
      'requestServices.CreateAt AS createAt',
      'requestServices.UpdateAt AS updateAt',
      'requestServices.NameService AS nameService',
      'requestServices.ListDetailService AS listDetailService',
      'requestServices.PriceService AS priceService',
      'requestServices.TypeEquipment AS typeEquipment',
      'requestServices.Note AS note',
      'requestServices.FileImage AS fileImage',
      'requestServices.Address AS address',
      'requestServices.Calender AS calender',
      'requestServices.Status AS status',
    ]);

    const result = await queryBuilder.getRawMany();
    const items = plainToClass(RequestServiceResponse, result, {
      excludeExtraneousValues: true,
    });
    return items;
  }

  async fixerReceiveRequest(
    id: string,
    fixerId: string,
  ): Promise<MessageResponse> {
    const fixer = await this.userService.findById(fixerId);
    if (!fixer) {
      throw new NotFoundException('Không tìm thấy thông tin người dùng');
    }

    const requestService = await this.requestServiceRes.findOne({
      where: { id },
    });
    if (!requestService) {
      throw new NotFoundException('Không tìm thấy request service');
    }

    // Cập nhật thông tin
    requestService.fixerId = fixerId;
    requestService.status = ServiceStatus.APPROVED;
    requestService.updateAt = new Date().getTime();

    await this.requestServiceRes.save(requestService);

    return {
      message: 'Fixer nhận request thành công',
      statusCode: HttpStatus.OK,
    };
  }

  async getOneById(id: string): Promise<RequestServiceEntity> {
    const service = await this.requestServiceRes.findOne({
      where: { id },
    });
    return service;
  }

  async remove(id: number): Promise<void> {
    const result = await this.requestServiceRes.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Icon with ID ${id} not found`);
    }
  }
}
