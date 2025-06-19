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
import { CreateIconDto } from './dto/create-list-detail-service.dto';
import { MessageResponse } from 'src/common/types/response';
import { ListDetailServiceService } from 'src/modules/listDetailService/listDetailService.service';
import { ListDetailServiceEntity } from 'src/database/entities/list-detail-service.entity';
import { ListDetailServiceResponse } from 'src/modules/listDetailService/types/listDetailService.types';
import { ApiTags } from '@nestjs/swagger';

@Controller('listDetailService')
@ApiTags('List Detail Service')
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
  async findOne(@Param('id') id: string): Promise<ListDetailServiceResponse[]> {
    return this.iconsService.getAllByServiceId(id);
  }

  @Get('unit/:unit')
  async getOneByUnit(
    @Param('unit') unit: string,
  ): Promise<ListDetailServiceResponse> {
    return this.iconsService.getOneByUnitId(unit);
  }
  // @Put(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() updateIconDto: UpdateIconDto,
  // ): Promise<ListDetailServiceEntity> {
  //   return this.iconsService.update(id, updateIconDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.iconsService.remove(id);
  }
}
