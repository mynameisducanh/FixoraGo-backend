import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryActiveRequestEntity } from 'src/database/entities/history-active-request.entity';
import { HistoryActiveRequestController } from './historyActiveRequest.controller';
import { HistoryActiveRequestService } from './historyActiveRequest.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoryActiveRequestEntity])
  ],
  providers: [HistoryActiveRequestService],
  controllers: [HistoryActiveRequestController],
  exports: [HistoryActiveRequestService],
})
export class HistoryActiveRequestModule {}
