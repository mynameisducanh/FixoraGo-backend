import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiTags } from '@nestjs/swagger';
import { MessageResponse } from 'src/common/types/response';
import { CreateServiceDto } from 'src/modules/services/dto/create-service.dto';
import { ServicesService } from 'src/modules/services/services.service';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createService(
    @Body() body: CreateServiceDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MessageResponse> {
    return await this.servicesService.createOne(body, file);
  }

  @Get(':id')
  async getServices(@Param('id') id: string) {
    return await this.servicesService.getOne(id);
  }
}
