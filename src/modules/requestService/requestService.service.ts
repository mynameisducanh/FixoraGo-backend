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
    body: any,
    files: Express.Multer.File[],
  ): Promise<MessageResponse> {
    let fileUrl;
    if (files && files.length > 0) {
      fileUrl = await this.cloudService.uploadFilesToCloud(files);
    }
    const newFileRecord: DeepPartial<RequestServiceEntity> = {
      userId: body.userId,
      staffId: null,
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
          'requestServices.staffId AS staffId',
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
          'requestServices.staffId AS staffId',
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
