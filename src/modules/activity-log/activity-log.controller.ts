import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ActivityLogService } from './activity-log.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';
import { ActivityLogEntity } from '../../database/entities/activity-log.entity';

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

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ActivityLogEntity> {
    return this.activityLogService.findOne(id);
  }

  @Get('request-service/:requestServiceId')
  findByRequestServiceId(@Param('requestServiceId') requestServiceId: string): Promise<ActivityLogEntity[]> {
    return this.activityLogService.findByRequestServiceId(requestServiceId);
  }

  @Get('check-fixer-checkin/:requestServiceId')
  checkFixerCheckin(@Param('requestServiceId') requestServiceId: string) {
    return this.activityLogService.checkFixerCheckin(requestServiceId);
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