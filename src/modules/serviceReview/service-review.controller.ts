import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ServiceReviewService } from './service-review.service';
import { CreateServiceReviewDto } from './dto/create-service-review.dto';
import { JwtAuth } from '../../common/decorators/jwt-auth.decorator';
import { User } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Controller('service-reviews')
export class ServiceReviewController {
  constructor(private readonly serviceReviewService: ServiceReviewService) {}

  @Post()
  @JwtAuth()
  async createReview(
    @Body() createServiceReviewDto: CreateServiceReviewDto,
    @User() user: JwtPayload,
  ) {
    return await this.serviceReviewService.createReview(
      createServiceReviewDto,
      user,
    );
  }

  @Get('requestService/:idRequestService')
  async getReviewsByService(@Param('idRequestService') idRequestService: string) {
    return await this.serviceReviewService.getReviewsByService(idRequestService);
  }

  @Get('fixer/:userId/average')
  async getAverageRating(@Param('userId') userId: string) {
    return await this.serviceReviewService.getAverageRatingForFixer(userId);
  }
} 