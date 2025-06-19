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
import { CreateIconDto } from './dto/create-icon-service.dto';
import { UpdateIconDto } from './dto/update-icon-service.dto';
import { IconServiceEntity } from 'src/database/entities/iconsService.entity';
import { MessageResponse } from 'src/common/types/response';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { IconServiceResponse } from 'src/modules/iconsService/types/iconService.types';

@Controller('iconsService')
@ApiTags('Icon service')
export class IconsServiceController {
  constructor(private readonly iconsService: IconsServiceService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data; charset=UTF-8')
  async create(
    @Body() body: CreateIconDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MessageResponse> {
    return await this.iconsService.createIconService(file, body);
  }

  @Get()
  async getAll() :Promise<IconServiceResponse[]> {
    return await this.iconsService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<IconServiceEntity> {
    return this.iconsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateIconDto: UpdateIconDto,
  ): Promise<IconServiceEntity> {
    return this.iconsService.update(id, updateIconDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.iconsService.remove(id);
  }
}
