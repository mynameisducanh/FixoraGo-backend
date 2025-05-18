import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceReviewService } from './service-review.service';
import { ServiceReviewController } from './service-review.controller';
import { ServiceReview } from '../../database/entities/service-review.entity';
import { RequestConfirmServiceModule } from 'src/modules/requestConfirmService/requestConfirmService.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceReview]),
    RequestConfirmServiceModule,
  ],
  controllers: [ServiceReviewController],
  providers: [ServiceReviewService],
  exports: [ServiceReviewService],
})
export class ServiceReviewModule {}
