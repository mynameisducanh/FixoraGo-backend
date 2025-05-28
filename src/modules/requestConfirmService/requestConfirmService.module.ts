import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestConfirmServiceEntity } from 'src/database/entities/request-confirm-service.entity';
import { RequestServiceEntity } from 'src/database/entities/request-service.entity';
import { RequestConfirmServiceController } from './requestConfirmService.controller';
import { RequestConfirmServiceService } from './requestConfirmService.service';
import { CloudService } from 'src/helpers/cloud.helper';
import { HistoryActiveRequestModule } from 'src/modules/historyActiveRequest/historyActiveRequest.module';
import { RevenueManagerModule } from '../revenue-manager/revenue-manager.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestConfirmServiceEntity,
      RequestServiceEntity,
    ]),
    HistoryActiveRequestModule,
    RevenueManagerModule,
  ],
  controllers: [RequestConfirmServiceController],
  providers: [RequestConfirmServiceService, CloudService],
  exports: [RequestConfirmServiceService],
})
export class RequestConfirmServiceModule {}
