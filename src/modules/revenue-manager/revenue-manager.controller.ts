import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { RevenueManagerService } from './revenue-manager.service';
import { CreateRevenueManagerDto } from './dto/create-revenue-manager.dto';
import { UpdateRevenueManagerDto } from './dto/update-revenue-manager.dto';
import { RevenueManagerEntity } from 'src/database/entities/revenue-manager.entity';

@Controller('revenue-manager')
export class RevenueManagerController {
  constructor(private readonly revenueManagerService: RevenueManagerService) {}

  @Post()
  create(
    @Body() createDto: CreateRevenueManagerDto,
  ): Promise<RevenueManagerEntity> {
    return this.revenueManagerService.create(createDto);
  }

  @Get()
  findAll(): Promise<RevenueManagerEntity[]> {
    return this.revenueManagerService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RevenueManagerEntity> {
    return this.revenueManagerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateRevenueManagerDto,
  ): Promise<RevenueManagerEntity> {
    return this.revenueManagerService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.revenueManagerService.remove(id);
  }

  // Các endpoint cập nhật tài chính
  @Patch(':id/total-revenue')
  updateTotalRevenue(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('amount') amount: number,
  ): Promise<RevenueManagerEntity> {
    return this.revenueManagerService.updateTotalRevenue(id, amount);
  }

  @Patch(':id/paid-fees')
  updatePaidFees(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('amount') amount: number,
  ): Promise<RevenueManagerEntity> {
    return this.revenueManagerService.updatePaidFees(id, amount);
  }

  @Patch(':id/unpaid-fees')
  updateUnpaidFees(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('amount') amount: number,
  ): Promise<RevenueManagerEntity> {
    return this.revenueManagerService.updateUnpaidFees(id, amount);
  }

  @Patch(':id/financial-info')
  updateFinancialInfo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    financialInfo: {
      totalRevenue: number;
      paidFees: number;
      unpaidFees: number;
    },
  ): Promise<RevenueManagerEntity> {
    return this.revenueManagerService.updateFinancialInfo(
      id,
      financialInfo.totalRevenue,
      financialInfo.paidFees,
      financialInfo.unpaidFees,
    );
  }

  // Các endpoint cập nhật tài chính mới
  @Patch(':temp/increment-total-revenue')
  incrementTotalRevenue(
    @Param('temp') temp: string,
    @Body('amount') amount: number,
  ): Promise<RevenueManagerEntity> {
    return this.revenueManagerService.incrementTotalRevenue(temp, amount);
  }

  @Patch(':temp/update-paid-fees')
  updatePaidFeesWithOperation(
    @Param('temp') temp: string,
    @Body() data: { amount: number; operation: 'add' | 'subtract' },
  ): Promise<RevenueManagerEntity> {
    return this.revenueManagerService.updatePaidFeesWithOperation(
      temp,
      data.amount,
      data.operation,
    );
  }

  @Patch(':temp/update-unpaid-fees')
  updateUnpaidFeesWithOperation(
    @Param('temp') temp: string,
    @Body() data: { amount: number; operation: 'add' | 'subtract' },
  ): Promise<RevenueManagerEntity> {
    return this.revenueManagerService.updateUnpaidFeesWithOperation(
      temp,
      data.amount,
      data.operation,
    );
  }

  // Các endpoint thống kê
  @Get('statistics/current-year')
  getCurrentYearRevenueStatistics() {
    return this.revenueManagerService.getCurrentYearRevenueStatistics();
  }

  @Get('statistics/yearly')
  getYearlyRevenueStatistics(@Query('year') year: number) {
    return this.revenueManagerService.getYearlyRevenueStatistics(year);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string,
  ): Promise<RevenueManagerEntity> {
    return this.revenueManagerService.updateStatus(id, status);
  }

  @Get('recent/bills')
  getAllBills() {
    return this.revenueManagerService.getAllBills();
  }
}
