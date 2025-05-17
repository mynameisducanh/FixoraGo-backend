import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestConfirmServiceEntity } from 'src/database/entities/request-confirm-service.entity';
import { RequestConfirmServiceController } from './requestConfirmService.controller';
import { RequestConfirmServiceService } from './requestConfirmService.service';
import { CloudService } from 'src/helpers/cloud.helper';
import { HistoryActiveRequestModule } from 'src/modules/historyActiveRequest/historyActiveRequest.module';
import { HistoryActiveRequestService } from 'src/modules/historyActiveRequest/historyActiveRequest.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestConfirmServiceEntity]),
    HistoryActiveRequestModule,
  ],
  providers: [RequestConfirmServiceService, CloudService, ],
  exports: [RequestConfirmServiceService],
})
export class RequestConfirmServiceModule {}
