import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateRequestConfirmServiceDto } from './dto/create-request-confirm-service.dto';
import { UpdateRequestConfirmServiceDto } from './dto/update-request-confirm-service.dto';
import { MessageResponse } from 'src/common/types/response';
import { plainToClass } from 'class-transformer';
import {
  RequestConfirmServiceEntity,
  ServiceType,
} from 'src/database/entities/request-confirm-service.entity';
import { RequestConfirmServiceResponse } from './types/requestConfirmService.types';
import { CloudService } from 'src/helpers/cloud.helper';

@Injectable()
export class RequestConfirmServiceService {
  constructor(
    @InjectRepository(RequestConfirmServiceEntity)
    private readonly requestConfirmServiceRes: Repository<RequestConfirmServiceEntity>,
    private readonly cloudService: CloudService,
  ) {}

  async save(
    service: DeepPartial<RequestConfirmServiceEntity>,
  ): Promise<RequestConfirmServiceEntity> {
    return await this.requestConfirmServiceRes.save(service);
  }

  async createRequestConfirmService(
    body: CreateRequestConfirmServiceDto,
    file: Express.Multer.File,
  ): Promise<MessageResponse & { id?: string }> {
    let imageUrl = '';
    console.log(body, file);
    if (file) {
      imageUrl = await this.cloudService.uploadFileToCloud(file);
    }

    const newService: DeepPartial<RequestConfirmServiceEntity> = {
      userId: body.userId,
      requestServiceId: body.requestServiceId,
      name: body.name,
      type: body.type,
      price: body.price,
      image: imageUrl,
      note: body.note,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
    };

    const savedService = await this.requestConfirmServiceRes.save(newService);
    return {
      message: 'Tạo request confirm service thành công',
      statusCode: HttpStatus.OK,
      id: savedService.id,
    };
  }

  async getOneById(id: string): Promise<RequestConfirmServiceResponse> {
    try {
      const queryResult = await this.requestConfirmServiceRes
        .createQueryBuilder('requestConfirmServices')
        .andWhere('requestConfirmServices.id = :id', { id: id })
        .addSelect([
          'requestConfirmServices.id AS id',
          'requestConfirmServices.requestConfirmId AS requestConfirmId',
          'requestConfirmServices.name AS name',
          'requestConfirmServices.type AS type',
          'requestConfirmServices.price AS price',
          'requestConfirmServices.image AS image',
          'requestConfirmServices.note AS note',
          'requestConfirmServices.createAt AS createAt',
          'requestConfirmServices.updateAt AS updateAt',
        ])
        .getRawOne();

      if (!queryResult) {
        throw new NotFoundException(
          `Request confirm service with ID ${id} not found`,
        );
      }

      return plainToClass(RequestConfirmServiceResponse, queryResult, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async getByRequestConfirmId(
    requestConfirmId: string,
  ): Promise<RequestConfirmServiceResponse[]> {
    try {
      const queryResult = await this.requestConfirmServiceRes
        .createQueryBuilder('requestConfirmServices')
        .andWhere(
          'requestConfirmServices.requestConfirmId = :requestConfirmId',
          {
            requestConfirmId: requestConfirmId,
          },
        )
        .addSelect([
          'requestConfirmServices.id AS id',
          'requestConfirmServices.requestConfirmId AS requestConfirmId',
          'requestConfirmServices.name AS name',
          'requestConfirmServices.type AS type',
          'requestConfirmServices.price AS price',
          'requestConfirmServices.image AS image',
          'requestConfirmServices.note AS note',
          'requestConfirmServices.createAt AS createAt',
          'requestConfirmServices.updateAt AS updateAt',
        ])
        .getRawMany();

      return plainToClass(RequestConfirmServiceResponse, queryResult, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateRequestConfirmService(
    id: string,
    body: UpdateRequestConfirmServiceDto,
    file: Express.Multer.File,
  ): Promise<MessageResponse> {
    try {
      const service = await this.requestConfirmServiceRes.findOne({
        where: { id: id },
      });

      if (!service) {
        throw new NotFoundException(
          `Request confirm service with ID ${id} not found`,
        );
      }

      const updateData: DeepPartial<RequestConfirmServiceEntity> = {
        name: body.name,
        price: body.price?.toString(),
        note: body.note,
        updateAt: new Date().getTime(),
      };

      if (file) {
        if (service.image) {
          await this.cloudService.deleteFileByUrl(service.image, 'image');
        }
        const imageUrl = await this.cloudService.uploadFileToCloud(file);
        updateData.image = imageUrl;
      }

      await this.requestConfirmServiceRes.update(id, updateData);

      return {
        message: 'Cập nhật request confirm service thành công',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteRequestConfirmService(id: string): Promise<MessageResponse> {
    try {
      const service = await this.requestConfirmServiceRes.findOne({
        where: { id: id },
      });

      if (!service) {
        throw new NotFoundException(
          `Request confirm service with ID ${id} not found`,
        );
      }

      if (service.image) {
        await this.cloudService.deleteFileByUrl(service.image, 'image');
      }

      await this.requestConfirmServiceRes.delete(id);

      return {
        message: 'Xóa request confirm service thành công',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }
}
