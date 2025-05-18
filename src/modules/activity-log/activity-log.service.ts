import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLogEntity, ActivityType } from '../../database/entities/activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';
import { CloudService } from '../../helpers/cloud.helper';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLogEntity)
    private activityLogRepository: Repository<ActivityLogEntity>,
    private readonly cloudService: CloudService,
  ) {}

  async create(createActivityLogDto: CreateActivityLogDto, file?: Express.Multer.File): Promise<ActivityLogEntity> {
    let imageUrl = '';
    if (file) {
      imageUrl = await this.cloudService.uploadFileToCloud(file);
    }

    const activityLog = this.activityLogRepository.create({
      ...createActivityLogDto,
      imageUrl: imageUrl || createActivityLogDto.imageUrl,
    });
    return await this.activityLogRepository.save(activityLog);
  }

  async findAll(): Promise<ActivityLogEntity[]> {
    return await this.activityLogRepository.find();
  }

  async findOne(id: string): Promise<ActivityLogEntity> {
    const activityLog = await this.activityLogRepository.findOne({ where: { id } });
    if (!activityLog) {
      throw new NotFoundException(`Activity log with ID ${id} not found`);
    }
    return activityLog;
  }

  async update(id: string, updateActivityLogDto: UpdateActivityLogDto, file?: Express.Multer.File): Promise<ActivityLogEntity> {
    const activityLog = await this.findOne(id);
    
    if (file) {
      if (activityLog.imageUrl) {
        await this.cloudService.deleteFileByUrl(activityLog.imageUrl, 'image');
      }
      const imageUrl = await this.cloudService.uploadFileToCloud(file);
      updateActivityLogDto.imageUrl = imageUrl;
    }

    Object.assign(activityLog, updateActivityLogDto);
    return await this.activityLogRepository.save(activityLog);
  }

  async remove(id: string): Promise<void> {
    const activityLog = await this.findOne(id);
    if (activityLog.imageUrl) {
      await this.cloudService.deleteFileByUrl(activityLog.imageUrl, 'image');
    }
    await this.activityLogRepository.remove(activityLog);
  }

  async findByRequestServiceId(requestServiceId: string): Promise<ActivityLogEntity[]> {
    return await this.activityLogRepository.find({
      where: { requestServiceId },
      order: { createAt: 'DESC' },
    });
  }

  async checkFixerCheckin(requestServiceId: string): Promise<{ hasCheckin: boolean; fixerId?: string }> {
    const activityLog = await this.activityLogRepository.findOne({
      where: {
        requestServiceId,
        activityType: ActivityType.STAFF_CHECKIN,
      },
      order: { createAt: 'DESC' },
    });
    console.log(activityLog)
    if (activityLog && activityLog.fixerId) {
      return {
        hasCheckin: true,
        fixerId: activityLog.fixerId,
      };
    }

    return {
      hasCheckin: false,
    };
  }
} 