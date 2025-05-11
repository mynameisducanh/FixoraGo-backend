import { HttpStatus, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageResponse } from 'src/common/types/response';
import { ServicesEntity } from 'src/database/entities/services.entity';
import { CloudService } from 'src/helpers/cloud.helper';
import { CreateServiceDto } from 'src/modules/services/dto/create-service.dto';
import { DeepPartial, Repository } from 'typeorm';
import { validate as validateUUID } from 'uuid';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServicesEntity)
    private readonly serviceRes: Repository<ServicesEntity>,
    private readonly cloudService : CloudService
  ) {}

  async save(service: DeepPartial<ServicesEntity>): Promise<ServicesEntity> {
    return await this.serviceRes.save(service);
  }

  async createOne(
    body: CreateServiceDto,
    file: Express.Multer.File,
  ): Promise<MessageResponse> {
    let urlImage = null;
    if(file){
      urlImage = await this.cloudService.uploadFileToCloud(file);
    }

    const serviceData = {
      categoryId: body.categoryId,
      name: body.name,
      description: body.description,
      duration: 0,
      totalUsage: 0,
      totalViews: 0,
      rating: 5,
      totalReviews: 0,
      imageUrl: file ? urlImage[0] : '', 
      isActive: true,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
    };
    await this.save(serviceData);

    return {
      statusCode: HttpStatus.OK,
      message: 'Tạo service thành công',
    };
  }

  async getOne(id: string): Promise<ServicesEntity> {
    if (!id || !validateUUID(id)) {
      throw new BadRequestException('Invalid service ID format');
    }

    const service = await this.serviceRes.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }
}
