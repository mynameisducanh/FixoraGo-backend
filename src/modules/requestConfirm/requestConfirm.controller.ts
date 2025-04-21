import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { CreateRequestConfirmDto } from './dto/create-request-confirm.dto';
import { UpdateRequestConfirmDto } from './dto/update-request-confirm.dto';
import { MessageResponse } from 'src/common/types/response';
import { RequestConfirmService } from './requestConfirm.service';
import { RequestConfirmResponse } from './types/requestConfirm.types';

@Controller('requestConfirm')
export class RequestConfirmController {
  constructor(private readonly requestConfirmService: RequestConfirmService) {}

  @Post()
  async create(@Body() body: CreateRequestConfirmDto): Promise<MessageResponse> {
    return await this.requestConfirmService.createRequestConfirm(body);
  }

  @Get(':id')
  async getOneById(@Param('id') id: string): Promise<RequestConfirmResponse> {
    return await this.requestConfirmService.getOneById(id);
  }

  @Get('request/:requestServiceId')
  async getByRequestServiceId(
    @Param('requestServiceId') requestServiceId: string,
  ): Promise<RequestConfirmResponse> {
    return await this.requestConfirmService.getByRequestServiceId(requestServiceId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateRequestConfirmDto,
  ): Promise<MessageResponse> {
    return await this.requestConfirmService.updateRequestConfirm(id, body);
  }
}
