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

@Injectable()
export class RequestServiceService {
  constructor(
    private readonly cloudService: CloudService,
    @InjectRepository(RequestServiceEntity)
    private readonly requestServiceRes: Repository<RequestServiceEntity>,
  ) {}

  async save(
    service: DeepPartial<RequestServiceEntity>,
  ): Promise<RequestServiceEntity> {
    return await this.requestServiceRes.save(service);
  }

  async createRequestService(
    body: CreateRequestServiceDto,
    files: Express.Multer.File[],
  ): Promise<MessageResponse> {
    let fileUrl;
    if (files) {
      fileUrl = await this.cloudService.uploadFilesToCloud(files);
    }
    const newFileRecord: DeepPartial<RequestServiceEntity> = {
      userId: body.userId,
      staffId: null,
      nameService: body.nameService,
      listDetailService: body.listDetailService,
      priceService: body.priceService,
      typeService: body.typeService,
      calender: body.calender,
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
          'requestServices.staffId AS staffId',
          'requestServices.CreateAt AS createAt',
          'requestServices.UpdateAt AS updateAt',
          'requestServices.NameService AS nameService',
          'requestServices.ListDetailService AS listDetailService',
          'requestServices.PriceService AS priceService',
          'requestServices.TypeService AS typeService',
          'requestServices.Note AS note',
          'requestServices.Status AS status',
        ]);

      const result = await data.getRawMany();
      const items = plainToClass(RequestServiceResponse, result, {
        excludeExtraneousValues: true,
      });
      return items;
    } catch (error) {}
  }

  async getAllByUserId(
    body: GetAllRequestServiceDto,
  ): Promise<RequestServiceResponse[]> {
    try {
      const queryResult =
        this.requestServiceRes.createQueryBuilder('requestServices');

      if (body.isStaff) {
        queryResult.where('requestServices.StaffId = :userId', {
          userId: body.userId,
        });
      } else {
        queryResult.where('requestServices.UserId = :userId', {
          userId: body.userId,
        });
      }

      const data = queryResult
        .orderBy('requestServices.UpdateAt', 'ASC')
        .addOrderBy('requestServices.CreateAt', 'ASC')
        .addSelect([
          'requestServices.id AS id',
          'requestServices.userId AS userId',
          'requestServices.staffId AS staffId',
          'requestServices.CreateAt AS createAt',
          'requestServices.UpdateAt AS updateAt',
          'requestServices.NameService AS nameService',
          'requestServices.ListDetailService AS listDetailService',
          'requestServices.PriceService AS priceService',
          'requestServices.TypeService AS typeService',
          'requestServices.Note AS note',
          'requestServices.Status AS status',
        ]);

      const result = await data.getRawMany();
      const items = plainToClass(RequestServiceResponse, result, {
        excludeExtraneousValues: true,
      });
      return items;
    } catch (error) {}
  }

  async getOneById(id: string): Promise<RequestServiceResponse> {
    try {
      const queryResult = this.requestServiceRes
        .createQueryBuilder('requestServices')
        .andWhere('requestServices.id = :id', { id: id })
        .addOrderBy('requestServices.CreateAt', 'ASC')
        .addSelect([
          'requestServices.id AS id',
          'requestServices.userId AS userId',
          'requestServices.staffId AS staffId',
          'requestServices.CreateAt AS createAt',
          'requestServices.UpdateAt AS updateAt',
          'requestServices.NameService AS nameService',
          'requestServices.ListDetailService AS listDetailService',
          'requestServices.PriceService AS priceService',
          'requestServices.TypeService AS typeService',
          'requestServices.Note AS note',
          'requestServices.Status AS status',
        ])
        .getRawMany();

      const items = plainToClass(RequestServiceResponse, queryResult, {
        excludeExtraneousValues: true,
      });

      return items;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.requestServiceRes.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Icon with ID ${id} not found`);
    }
  }
}
