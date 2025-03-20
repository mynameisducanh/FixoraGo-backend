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

@Injectable()
export class RequestServiceService {
  constructor(
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
  ): Promise<MessageResponse> {
    const newFileRecord: DeepPartial<RequestServiceEntity> = {
      userId: 0,
      staffId: 0,
      nameService: body.nameService,
      listDetailService: body.listDetailService,
      priceService: body.priceService,
      typeService: body.typeService,
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
          'requestServices.CreateAt AS createAt',
          'requestServices.UpdateAt AS updateAt',
          'requestServices.UserId AS userId',
          'requestServices.StaffId AS staffId',
          'requestServices.ServiceId AS serviceId',
          'requestServices.UnitService AS unitService',
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

  async getAllByServiceId(
    ServiceId: number,
  ): Promise<RequestServiceResponse[]> {
    try {
      const queryResult =
        this.requestServiceRes.createQueryBuilder('requestServices');

      const data = queryResult
        .where('requestServices.ServiceId = :ServiceId', { ServiceId })
        .orderBy('requestServices.UpdateAt', 'ASC')
        .addOrderBy('requestServices.CreateAt', 'ASC')
        .addSelect([
          'requestServices.id AS id',
          'requestServices.CreateAt AS createAt',
          'requestServices.UpdateAt AS updateAt',
          'requestServices.UserId AS userId',
          'requestServices.StaffId AS staffId',
          'requestServices.ServiceId AS serviceId',
          'requestServices.UnitService AS unitService',
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
      const requestService = await this.requestServiceRes.findOne({
        where: { id },
      });
      return requestService;
    } catch (error) {}
  }

  // async update(
  //   id: number,
  //   updateIconDto: UpdateIconDto,
  // ): Promise<RequestServiceEntity> {
  //   await this.findOne(id);
  //   await this.requestServiceRes.update(id, updateIconDto);
  //   return this.findOne(id);
  // }

  async remove(id: number): Promise<void> {
    const result = await this.requestServiceRes.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Icon with ID ${id} not found`);
    }
  }
}
