import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestConfirmEntity } from 'src/database/entities/request-confirm.entity';
import { RequestConfirmController } from './requestConfirm.controller';
import { RequestConfirmService } from './requestConfirm.service';

@Module({
  imports: [TypeOrmModule.forFeature([RequestConfirmEntity])],
  providers: [RequestConfirmService],
  controllers: [RequestConfirmController],
  exports: [RequestConfirmService],
})
export class RequestConfirmModule {}
