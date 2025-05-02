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

  @Get('service/:idRequestService')
  async getReviewsByService(@Param('idRequestService') idRequestService: string) {
    return await this.serviceReviewService.getReviewsByService(idRequestService);
  }

  @Get('service/:idRequestService/average')
  async getAverageRating(@Param('idRequestService') idRequestService: string) {
    return await this.serviceReviewService.getAverageRating(idRequestService);
  }
} 