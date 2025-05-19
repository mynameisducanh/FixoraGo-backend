import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateIconDto } from './dto/create-list-detail-service.dto';
import { MessageResponse } from 'src/common/types/response';
import { plainToClass } from 'class-transformer';
import { ListDetailServiceEntity } from 'src/database/entities/list-detail-service.entity';
import { ListDetailServiceResponse } from 'src/modules/listDetailService/types/listDetailService.types';

@Injectable()
export class ListDetailServiceService {
  constructor(
    @InjectRepository(ListDetailServiceEntity)
    private readonly listDetailServiceRes: Repository<ListDetailServiceEntity>,
  ) {}

  async save(
    service: DeepPartial<ListDetailServiceEntity>,
  ): Promise<ListDetailServiceEntity> {
    return await this.listDetailServiceRes.save(service);
  }

  async createIconService(body: CreateIconDto): Promise<MessageResponse> {
    const newFileRecord: DeepPartial<ListDetailServiceEntity> = {
      name: body.name,
      type: body.type,
      serviceId: body.serviceId,
      unit: body.unit,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
    };
    this.listDetailServiceRes.save(newFileRecord);
    return {
      message: 'Tạo detail service thành công',
      statusCode: HttpStatus.OK,
    };
  }

  async getAll(): Promise<ListDetailServiceResponse[]> {
    try {
      const queryResult =
        this.listDetailServiceRes.createQueryBuilder('listDetailService');

      const data = queryResult
        .orderBy('listDetailService.UpdateAt', 'ASC')
        .addOrderBy('listDetailService.CreateAt', 'ASC')
        .addSelect([
          'listDetailService.id AS id',
          'listDetailService.CreateAt AS createAt',
          'listDetailService.UpdateAt AS updateAt',
          'listDetailService.Name AS name',
          'listDetailService.ServiceId AS serviceId',
          'listDetailService.Type AS type',
          'listDetailService.Unit AS unit',
        ]);

      const result = await data.getRawMany();
      const items = plainToClass(ListDetailServiceResponse, result, {
        excludeExtraneousValues: true,
      });
      return items;
    } catch (error) {}
  }

  async getAllByServiceId(
    ServiceId: string,
  ): Promise<ListDetailServiceResponse[]> {
    try {
      const queryResult =
        this.listDetailServiceRes.createQueryBuilder('listDetailService');
      const data = queryResult
        .where('listDetailService.serviceId = :ServiceId', { ServiceId })
        .orderBy('listDetailService.UpdateAt', 'ASC')
        .addOrderBy('listDetailService.CreateAt', 'ASC')
        .addSelect([
          'listDetailService.id AS id',
          'listDetailService.CreateAt AS createAt',
          'listDetailService.UpdateAt AS updateAt',
          'listDetailService.name AS name',
          'listDetailService.serviceId AS serviceId',
          'listDetailService.type AS type',
          'listDetailService.unit AS unit',
        ]);

      const result = await data.getRawMany();
      const items = plainToClass(ListDetailServiceResponse, result, {
        excludeExtraneousValues: true,
      });
      return items;
    } catch (error) {}
  }

  async getOneByUnitId(
    unit: string,
  ): Promise<ListDetailServiceResponse> {
    try {
      const priceService = await this.listDetailServiceRes.findOne({
        where: { unit },
      });
      return priceService;
    } catch (error) {}
  }

  // async update(
  //   id: number,
  //   updateIconDto: UpdateIconDto,
  // ): Promise<ListDetailServiceEntity> {
  //   await this.findOne(id);
  //   await this.listDetailServiceRes.update(id, updateIconDto);
  //   return this.findOne(id);
  // }

  async remove(id: string): Promise<void> {
    const result = await this.listDetailServiceRes.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Icon with ID ${id} not found`);
    }
  }
}
