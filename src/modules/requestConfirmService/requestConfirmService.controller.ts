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
  Patch,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRequestConfirmServiceDto } from './dto/create-request-confirm-service.dto';
import { UpdateRequestConfirmServiceDto } from './dto/update-request-confirm-service.dto';
import { MessageResponse } from 'src/common/types/response';
import { RequestConfirmServiceService } from './requestConfirmService.service';
import { RequestConfirmServiceResponse } from './types/requestConfirmService.types';
import { ApiConsumes } from '@nestjs/swagger';

@Controller('requestConfirmService')
export class RequestConfirmServiceController {
  constructor(
    private readonly requestConfirmServiceService: RequestConfirmServiceService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() body: CreateRequestConfirmServiceDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MessageResponse & { id?: string }> {
    return await this.requestConfirmServiceService.createRequestConfirmService(
      body,
      file,
    );
  }

  @Get(':id')
  async getOneById(
    @Param('id') id: string,
  ): Promise<RequestConfirmServiceResponse> {
    return await this.requestConfirmServiceService.getOneById(id);
  }

  @Get('confirm/:requestServiceId')
  async getByRequestConfirmId(
    @Param('requestServiceId') requestServiceId: string,
    @Query('type') type: string,
  ): Promise<RequestConfirmServiceResponse[]> {
    return await this.requestConfirmServiceService.getByRequestConfirmId(
      requestServiceId,
      type,
    );
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateRequestConfirmServiceDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MessageResponse> {
    return await this.requestConfirmServiceService.updateRequestConfirmService(
      id,
      body,
      file,
    );
  }

  @Get('check-fixer-completed/:id')
  checkFixerCheckin(@Param('id') id: string) {
    return this.requestConfirmServiceService.checkFixerCompleted(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<MessageResponse> {
    return await this.requestConfirmServiceService.deleteRequestConfirmService(
      id,
    );
  }

  @Patch('accept/:id')
  async userAccept(@Param('id') id: string): Promise<MessageResponse> {
    return await this.requestConfirmServiceService.userAccept(id);
  }

  @Get('revenue/user/:userId')
  async getUserRevenueStatistics(@Param('userId') userId: string) {
    return await this.requestConfirmServiceService.getUserRevenueStatistics(userId);
  }

  @Get('revenue/user/:userId/monthly')
  async getUserMonthlyRevenue(@Param('userId') userId: string) {
    return await this.requestConfirmServiceService.getUserMonthlyRevenue(userId);
  }

  @Get('revenue/total')
  async getTotalRevenue() {
    return await this.requestConfirmServiceService.getTotalRevenue();
  }

  @Get('revenue/yearly')
  async getYearlyRevenue() {
    return await this.requestConfirmServiceService.getYearlyRevenue();
  }

  @Get('propose/check/:requestServiceId')
  async getPropose(@Param('requestServiceId') requestServiceId: string) {
    return await this.requestConfirmServiceService.checkTotalTypeByRequestServiceId(requestServiceId);
  }
}
