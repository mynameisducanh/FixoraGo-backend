import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogEntity } from '../../database/entities/activity-log.entity';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogController } from './activity-log.controller';
import { CloudService } from '../../helpers/cloud.helper';
import { MulterModule } from '@nestjs/platform-express/multer';
import multer from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityLogEntity]),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  providers: [ActivityLogService, CloudService],
  controllers: [ActivityLogController],
  exports: [ActivityLogService],
})
export class ActivityLogModule {} 