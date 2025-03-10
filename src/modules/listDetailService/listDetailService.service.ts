import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { IconServiceEntity } from 'src/database/entities/iconsService.entity';
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
      service_id: body.service_id,
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
          'listDetailService.ServiceId AS service_id',
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
    ServiceId: number,
  ): Promise<ListDetailServiceResponse[]> {
    try {
      const queryResult =
        this.listDetailServiceRes.createQueryBuilder('listDetailService');

      const data = queryResult
        .where('listDetailService.ServiceId = :ServiceId', { ServiceId })
        .orderBy('listDetailService.UpdateAt', 'ASC')
        .addOrderBy('listDetailService.CreateAt', 'ASC')
        .addSelect([
          'listDetailService.id AS id',
          'listDetailService.CreateAt AS createAt',
          'listDetailService.UpdateAt AS updateAt',
          'listDetailService.Name AS name',
          'listDetailService.ServiceId AS service_id',
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
  async findOne(id: number): Promise<ListDetailServiceEntity> {
    const icon = await this.listDetailServiceRes.findOne({ where: { id } });
    if (!icon) {
      throw new NotFoundException(`Icon with ID ${id} not found`);
    }
    return icon;
  }

  // async update(
  //   id: number,
  //   updateIconDto: UpdateIconDto,
  // ): Promise<ListDetailServiceEntity> {
  //   await this.findOne(id);
  //   await this.listDetailServiceRes.update(id, updateIconDto);
  //   return this.findOne(id);
  // }

  async remove(id: number): Promise<void> {
    const result = await this.listDetailServiceRes.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Icon with ID ${id} not found`);
    }
  }
}
