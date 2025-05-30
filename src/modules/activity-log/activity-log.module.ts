import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogEntity } from '../../database/entities/activity-log.entity';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogController } from './activity-log.controller';
import { CloudService } from '../../helpers/cloud.helper';
import { MulterModule } from '@nestjs/platform-express/multer';
import multer from 'multer';
import { HistoryActiveRequestModule } from '../historyActiveRequest/historyActiveRequest.module';
import { RevenueManagerModule } from '../revenue-manager/revenue-manager.module';
import { NotificationModule } from '../notification/notification.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityLogEntity]),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    HistoryActiveRequestModule,
    forwardRef(() => RevenueManagerModule),
    NotificationModule,
    forwardRef(() => UsersModule),
  ],
  providers: [ActivityLogService, CloudService],
  controllers: [ActivityLogController],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}
