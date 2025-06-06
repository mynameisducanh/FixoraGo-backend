import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ActivityLogService } from './activity-log.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';
import { ActivityLogEntity } from '../../database/entities/activity-log.entity';
import { FilterActivityLogDto } from './dto/filter-activity-log.dto';

@Controller('activity-logs')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createActivityLogDto: CreateActivityLogDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ActivityLogEntity> {
    return this.activityLogService.create(createActivityLogDto, file);
  }

  @Get()
  findAll(): Promise<ActivityLogEntity[]> {
    return this.activityLogService.findAll();
  }

  @Get('all/byFilter')
  findAllByFilter(
    @Query() filter: FilterActivityLogDto,
  ): Promise<ActivityLogEntity[]> {
    return this.activityLogService.getAllByFilter(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ActivityLogEntity> {
    return this.activityLogService.findOne(id);
  }

  @Get('request-service/:requestServiceId')
  findByRequestServiceId(
    @Param('requestServiceId') requestServiceId: string,
  ): Promise<ActivityLogEntity[]> {
    return this.activityLogService.findByRequestServiceId(requestServiceId);
  }

  @Get('request-service/:requestServiceId/staff-checkin')
  findByRequestServiceIdAndStaffCheckin(
    @Param('requestServiceId') requestServiceId: string,
  ): Promise<ActivityLogEntity> {
    return this.activityLogService.findByRequestServiceIdAndStaffCheckin(requestServiceId);
  }

  @Get('check-fixer-checkin/:requestServiceId')
  checkFixerCheckin(@Param('requestServiceId') requestServiceId: string) {
    return this.activityLogService.checkFixerCheckin(requestServiceId);
  }
  @Get('check-user-confirm-checkin/:requestServiceId')
  checkUserConfirmCheckin(@Param('requestServiceId') requestServiceId: string) {
    return this.activityLogService.checkUserConfirmCheckin(requestServiceId);
  }
  @Get('all/staff-payfee/:userId')
  findAllStaffPayfee(
    @Param('userId') userId: string,
  ): Promise<ActivityLogEntity[]> {
    return this.activityLogService.findAllStaffPayfee(userId);
  }

  @Get('all/user-report/:userId')
  findAllReportByUserId(
    @Param('userId') userId: string,
  ): Promise<ActivityLogEntity[]> {
    return this.activityLogService.findAllUserReport(userId);
  }

  @Get('all/staff-report/:fixerId')
  findAllReportByFixerId(
    @Param('fixerId') fixerId: string,
  ): Promise<ActivityLogEntity[]> {
    return this.activityLogService.findAllStaffReport(fixerId);
  }

  @Patch('update-temp/:id')
  updateTemp(
    @Param('id') id: string,
    @Body('temp') temp: string,
  ): Promise<ActivityLogEntity> {
    return this.activityLogService.updateTemp(id, temp);
  }

  @Patch('update-temp-timestamp/:id')
  updateTempAndTimestamp(
    @Param('id') id: string,
    @Body('temp') temp: string,
  ): Promise<ActivityLogEntity> {
    return this.activityLogService.updateTempAndTimestamp(id, temp);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateActivityLogDto: UpdateActivityLogDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ActivityLogEntity> {
    return this.activityLogService.update(id, updateActivityLogDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.activityLogService.remove(id);
  }
}
