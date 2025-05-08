import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { HistoryActiveRequestService } from './historyActiveRequest.service';
import { CreateHistoryActiveRequestDto } from './dto/create-history-active-request.dto';
import { HistoryActiveRequestEntity } from 'src/database/entities/history-active-request.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('History Active Request')
@Controller('historyActiveRequest')
export class HistoryActiveRequestController {
  constructor(private readonly historyActiveRequestService: HistoryActiveRequestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new history record' })
  @ApiResponse({ status: 201, description: 'History record created successfully' })
  async create(@Body() createDto: CreateHistoryActiveRequestDto): Promise<HistoryActiveRequestEntity> {
    return await this.historyActiveRequestService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all history records' })
  @ApiResponse({ status: 200, description: 'Return all history records' })
  async getAll(): Promise<HistoryActiveRequestEntity[]> {
    return await this.historyActiveRequestService.getAll();
  }

  @Get('requestService/:requestServiceId')
  @ApiOperation({ summary: 'Get history records by request service ID' })
  @ApiResponse({ status: 200, description: 'Return history records for the specified request service' })
  async getByRequestServiceId(@Param('requestServiceId') requestServiceId: string): Promise<HistoryActiveRequestEntity[]> {
    return await this.historyActiveRequestService.getByRequestServiceId(requestServiceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a history record by ID' })
  @ApiResponse({ status: 200, description: 'Return the specified history record' })
  async getOne(@Param('id') id: string): Promise<HistoryActiveRequestEntity> {
    return await this.historyActiveRequestService.getOneById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a history record' })
  @ApiResponse({ status: 200, description: 'History record deleted successfully' })
  async delete(@Param('id') id: string): Promise<void> {
    return await this.historyActiveRequestService.delete(id);
  }
}
