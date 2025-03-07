import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { IconServiceEntity } from 'src/database/entities/iconsService.entity';
import { CreateIconDto } from './dto/create-icon-service.dto';
import { UpdateIconDto } from './dto/update-icon-service.dto';
import { IconServiceResponse } from 'src/modules/iconsService/types/iconService.types';
import { CloudService } from 'src/helpers/cloud.helper';
import { MessageResponse } from 'src/common/types/response';
import { plainToClass } from 'class-transformer';

@Injectable()
export class IconsServiceService {
  constructor(
    private readonly cloudService: CloudService,
    @InjectRepository(IconServiceEntity)
    private readonly iconServiceRes: Repository<IconServiceEntity>,
  ) {}

  async save(
    service: DeepPartial<IconServiceEntity>,
  ): Promise<IconServiceEntity> {
    return await this.iconServiceRes.save(service);
  }

  async createIconService(
    file: Express.Multer.File,
    body: CreateIconDto,
  ): Promise<MessageResponse> {
    const fileUrl = await this.cloudService.uploadLottieFilesToCloud(file);
    const newFileRecord: DeepPartial<IconServiceEntity> = {
      name: body.name,
      type: body.type,
      idService: 0,
      url: fileUrl,
      totalViews: 0,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
    };
    this.iconServiceRes.save(newFileRecord);
    return {
      message: 'Tạo Icon thành công',
      statusCode: HttpStatus.OK,
    };
  }

  async getAll(): Promise<IconServiceResponse> {
    try {
      const queryResult =
        this.iconServiceRes.createQueryBuilder('iconsService');

      const data = queryResult
        .orderBy('iconsService.UpdateAt', 'DESC')
        .addOrderBy('iconsService.CreateAt', 'DESC')
        .addSelect([
          'iconsService.id AS id',
          'iconsService.CreateAt AS createAt',
          'iconsService.UpdateAt AS updateAt',
          'iconsService.Name AS name',
          'iconsService.Url AS url',
          'iconsService.Type AS type',
          'iconsService.idService AS idService',
          'iconsService.totalViews AS totalViews',
        ]);

      const result = await data.getRawOne();
      const items = plainToClass(IconServiceResponse, result, {
        excludeExtraneousValues: true,
      });
      return items;
    } catch (error) {}
  }

  async findOne(id: number): Promise<IconServiceEntity> {
    const icon = await this.iconServiceRes.findOne({ where: { id } });
    if (!icon) {
      throw new NotFoundException(`Icon with ID ${id} not found`);
    }
    return icon;
  }

  async update(
    id: number,
    updateIconDto: UpdateIconDto,
  ): Promise<IconServiceEntity> {
    await this.findOne(id);
    await this.iconServiceRes.update(id, updateIconDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.iconServiceRes.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Icon with ID ${id} not found`);
    }
  }
}
