import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { MessageResponse } from 'src/common/types/response';
import { plainToClass } from 'class-transformer';
import { PriceServiceResponse } from 'src/modules/pricesService/types/priceService.types';
import { CreatePricesServiceDto } from 'src/modules/pricesService/dto/create-icon-service.dto';
import { PricesServiceEntity } from 'src/database/entities/prices-service.entity';

@Injectable()
export class PriceServiceService {
  constructor(
    @InjectRepository(PricesServiceEntity)
    private readonly priceServiceRes: Repository<PricesServiceEntity>,
  ) {}

  async save(
    service: DeepPartial<PricesServiceEntity>,
  ): Promise<PricesServiceEntity> {
    return await this.priceServiceRes.save(service);
  }

  async getOne(id: string): Promise<PricesServiceEntity> {
    const priceService = await this.priceServiceRes.findOne({
      where: { id },
    });
    return priceService;
  }
  async getOneByUnitId(unitService: string): Promise<PricesServiceEntity> {
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
    const newFileRecord: DeepPartial<PricesServiceEntity> = {
      name: body.name,
      serviceId: body.serviceId,
      unitService: body.unitService,
      price: body.price,
      min_price: body.min_price,
      max_price: body.max_price,
      imageUrl: '',
      totalUse: '',
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
        this.priceServiceRes.createQueryBuilder('priceService');

      const data = queryResult
        .orderBy('priceService.UpdateAt', 'ASC')
        .addOrderBy('priceService.CreateAt', 'ASC')
        .addSelect([
          'priceService.id AS id',
          'priceService.CreateAt AS createAt',
          'priceService.UpdateAt AS updateAt',
          'priceService.Name AS name',
          'priceService.ServiceId AS serviceId',
          'priceService.UnitService AS unitService',
          'priceService.Price AS price',
          'priceService.Min_price AS min_price',
          'priceService.Max_price AS max_price',
          'priceService.ImageUrl AS imageUrl',
          'priceService.TotalUse AS totalUse',
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
        this.priceServiceRes.createQueryBuilder('priceService');

      const data = queryResult
        .where('priceService.UnitService = :unitService', { unitService })
        .orderBy('priceService.UpdateAt', 'ASC')
        .addOrderBy('priceService.CreateAt', 'ASC')
        .addSelect([
          'priceService.id AS id',
          'priceService.CreateAt AS createAt',
          'priceService.UpdateAt AS updateAt',
          'priceService.Name AS name',
          'priceService.ServiceId AS serviceId',
          'priceService.UnitService AS unitService',
          'priceService.Price AS price',
          'priceService.Min_price AS min_price',
          'priceService.Max_price AS max_price',
          'priceService.ImageUrl AS imageUrl',
          'priceService.TotalUse AS totalUse',
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
