import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { IconsServiceService } from 'src/modules/iconsService/iconsService.service';
import { CreateIconDto } from './dto/create-list-detail-service.dto';
import { UpdateIconDto } from './dto/update-icon-service.dto';
import { IconServiceEntity } from 'src/database/entities/iconsService.entity';
import { MessageResponse } from 'src/common/types/response';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiConsumes } from '@nestjs/swagger';
import { IconServiceResponse } from 'src/modules/iconsService/types/iconService.types';
import { ListDetailServiceService } from 'src/modules/listDetailService/listDetailService.service';
import { ListDetailServiceEntity } from 'src/database/entities/list-detail-service.entity';
import { ListDetailServiceResponse } from 'src/modules/listDetailService/types/listDetailService.types';

@Controller('listDetailService')
export class ListDetailServiceController {
  constructor(private readonly iconsService: ListDetailServiceService) {}

  @Post()
  async create(@Body() body: CreateIconDto): Promise<MessageResponse> {
    return await this.iconsService.createIconService(body);
  }

  @Get()
  async getAll(): Promise<ListDetailServiceResponse[]> {
    return await this.iconsService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ListDetailServiceResponse[]> {
    return this.iconsService.getAllByServiceId(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateIconDto: UpdateIconDto,
  ): Promise<ListDetailServiceEntity> {
    return this.iconsService.update(id, updateIconDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.iconsService.remove(id);
  }
}
