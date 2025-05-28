import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevenueManagerEntity } from 'src/database/entities/revenue-manager.entity';
import { RevenueManagerController } from './revenue-manager.controller';
import { RevenueManagerService } from './revenue-manager.service';
import { UsersModule } from '../users/users.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RevenueManagerEntity]),
    forwardRef(() => UsersModule),
    NotificationModule
  ],
  controllers: [RevenueManagerController],
  providers: [RevenueManagerService],
  exports: [RevenueManagerService],
})
export class RevenueManagerModule {} 