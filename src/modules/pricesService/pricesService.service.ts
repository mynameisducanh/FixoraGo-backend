import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { MessageResponse } from 'src/common/types/response';
import { plainToClass } from 'class-transformer';
import { PriceServiceResponse } from 'src/modules/pricesService/types/priceService.types';
import { CreatePricesServiceDto } from 'src/modules/pricesService/dto/create-icon-service.dto';
import { TypeServiceEntity } from 'src/database/entities/type-service.entity';

@Injectable()
export class PriceServiceService {
  constructor(
    @InjectRepository(TypeServiceEntity)
    private readonly priceServiceRes: Repository<TypeServiceEntity>,
  ) {}

  async save(
    service: DeepPartial<TypeServiceEntity>,
  ): Promise<TypeServiceEntity> {
    return await this.priceServiceRes.save(service);
  }

  async getOne(id: string): Promise<TypeServiceEntity> {
    const priceService = await this.priceServiceRes.findOne({ where: { id } });
    return priceService;
  }
  async getOneByUnitId(unitService: string): Promise<TypeServiceEntity> {
    try {
      const priceService = await this.priceServiceRes.findOne({
        where: { unitService },
      });
      return priceService;
    } catch (error) {}
  }
  async createPricesService(
    file: Express.Multer.File,
    body: CreatePricesServiceDto,
  ): Promise<MessageResponse> {
    const newFileRecord: DeepPartial<TypeServiceEntity> = {
      name: body.name,
      serviceId: body.serviceId,
      unitService: body.unitService,
      time: body.time,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
    };
    this.priceServiceRes.save(newFileRecord);
    return {
      message: 'Tạo prices service thành công',
      statusCode: HttpStatus.OK,
    };
  }

  async getAll(): Promise<PriceServiceResponse[]> {
    try {
      const queryResult =
        this.priceServiceRes.createQueryBuilder('typeService');

      const data = queryResult
        .orderBy('typeService.UpdateAt', 'ASC')
        .addOrderBy('typeService.CreateAt', 'ASC')
        .addSelect([
          'typeService.id AS id',
          'typeService.CreateAt AS createAt',
          'typeService.UpdateAt AS updateAt',
          'typeService.Name AS name',
          'typeService.ServiceId AS serviceId',
          'typeService.UnitService AS unitService',
          'typeService.time AS time',
          'typeService.ImageUrl AS imageUrl',
        ]);

      const result = await data.getRawMany();
      const items = plainToClass(PriceServiceResponse, result, {
        excludeExtraneousValues: true,
      });
      return items;
    } catch (error) {}
  }

  async getAllByUnitService(
    unitService: string,
  ): Promise<PriceServiceResponse[]> {
    try {
      const queryResult =
        this.priceServiceRes.createQueryBuilder('typeService');

      const data = queryResult
        .where('typeService.UnitService = :unitService', { unitService })
        .orderBy('typeService.UpdateAt', 'ASC')
        .addOrderBy('typeService.CreateAt', 'ASC')
        .addSelect([
          'typeService.id AS id',
          'typeService.CreateAt AS createAt',
          'typeService.UpdateAt AS updateAt',
          'typeService.name AS name',
          'typeService.ServiceId AS serviceId',
          'typeService.UnitService AS unitService',
          'typeService.time AS time',
          'typeService.ImageUrl AS imageUrl',
        ]);

      const result = await data.getRawMany();
      const items = plainToClass(PriceServiceResponse, result, {
        excludeExtraneousValues: true,
      });

      return items;
    } catch (error) {}
  }

  async remove(id: number): Promise<void> {
    const result = await this.priceServiceRes.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Icon with ID ${id} not found`);
    }
  }
}
