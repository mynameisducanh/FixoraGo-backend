import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestConfirmServiceEntity } from 'src/database/entities/request-confirm-service.entity';
import { RequestConfirmServiceController } from './requestConfirmService.controller';
import { RequestConfirmServiceService } from './requestConfirmService.service';
import { CloudService } from 'src/helpers/cloud.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestConfirmServiceEntity])
  ],
  providers: [RequestConfirmServiceService,CloudService],
  controllers: [RequestConfirmServiceController],
  exports: [RequestConfirmServiceService],
})
export class RequestConfirmServiceModule {} 