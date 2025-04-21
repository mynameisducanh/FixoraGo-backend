import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRequestConfirmServiceDto } from './dto/create-request-confirm-service.dto';
import { MessageResponse } from 'src/common/types/response';
import { RequestConfirmServiceService } from './requestConfirmService.service';
import { RequestConfirmServiceResponse } from './types/requestConfirmService.types';

@Controller('requestConfirmService')
export class RequestConfirmServiceController {
  constructor(private readonly requestConfirmServiceService: RequestConfirmServiceService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() body: CreateRequestConfirmServiceDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MessageResponse> {
    return await this.requestConfirmServiceService.createRequestConfirmService(body, file);
  }

  @Get(':id')
  async getOneById(@Param('id') id: string): Promise<RequestConfirmServiceResponse> {
    return await this.requestConfirmServiceService.getOneById(id);
  }

  @Get('confirm/:requestConfirmId')
  async getByRequestConfirmId(
    @Param('requestConfirmId') requestConfirmId: string,
  ): Promise<RequestConfirmServiceResponse[]> {
    return await this.requestConfirmServiceService.getByRequestConfirmId(requestConfirmId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<MessageResponse> {
    return await this.requestConfirmServiceService.deleteRequestConfirmService(id);
  }
} 