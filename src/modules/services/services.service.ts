import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicesEntity } from 'src/database/entities/services.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServicesEntity)
    private readonly serviceRes: Repository<ServicesEntity>,
  ) {}

  async save(user: DeepPartial<ServicesEntity>): Promise<ServicesEntity> {
    return await this.serviceRes.save(user);
  }

  async getOne(id: string): Promise<ServicesEntity> {
    const service = await this.serviceRes.findOne({
      where: { id },
    });
    return service;
  }
}
