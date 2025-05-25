import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ServiceReviewService } from './service-review.service';
import { CreateServiceReviewDto } from './dto/create-service-review.dto';
import { JwtAuth } from '../../common/decorators/jwt-auth.decorator';
import { User } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ServiceReview } from 'src/database/entities/service-review.entity';

@ApiTags('Service Reviews')
@Controller('service-reviews')
export class ServiceReviewController {
  constructor(private readonly serviceReviewService: ServiceReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  async createReview(
    @Body() createServiceReviewDto: CreateServiceReviewDto,
  ) {
    return await this.serviceReviewService.createReview(
      createServiceReviewDto,
    );
  }

  @Get('requestService/:idRequestService')
  @ApiOperation({ summary: 'Get reviews by request service ID' })
  @ApiResponse({
    status: 200,
    description: 'Return reviews for the specified request service',
  })
  async getReviewsByService(
    @Param('idRequestService') idRequestService: string,
  ) {
    return await this.serviceReviewService.getReviewsByService(
      idRequestService,
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get reviews by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Return reviews for the specified user',
  })
  async getReviewsByUserId(@Param('userId') userId: string) {
    return await this.serviceReviewService.getReviewsByUserId(userId);
  }

  @Get('fixer/:fixerId')
  @ApiOperation({ summary: 'Get reviews by fixer ID' })
  @ApiResponse({
    status: 200,
    description: 'Return reviews for the specified fixer',
  })
  async getReviewsByFixerId(@Param('fixerId') fixerId: string) {
    console.log(fixerId);
    return await this.serviceReviewService.getReviewsByFixerId(fixerId);
  }

  @Get('fixer/:fixerId/average')
  @ApiOperation({ summary: 'Get average rating and review count for a fixer' })
  @ApiResponse({
    status: 200,
    description: 'Return average rating and review count for the specified fixer',
  })
  async getAverageRatingForFixer(
    @Param('fixerId') fixerId: string,
  ): Promise<{ average: number; count: number }> {
    return await this.serviceReviewService.getAverageRatingForFixer(fixerId);
  }

  @Get('fixer/:fixerId/count')
  async getReviewCountForFixer(
    @Param('fixerId') fixerId: string,
  ): Promise<{ count: number }> {
    const count = await this.serviceReviewService.getReviewCountForFixer(fixerId);
    return { count };
  }

  @Get('check-review/:requestServiceId')
  @JwtAuth()
  @ApiOperation({ summary: 'Check if user has reviewed a request service' })
  @ApiResponse({
    status: 200,
    description: 'Return whether user has reviewed and the review if exists',
  })
  async checkUserReview(
    @Param('requestServiceId') requestServiceId: string,
    @User() user: JwtPayload,
  ): Promise<{ hasReviewed: boolean; review?: ServiceReview }> {
    return await this.serviceReviewService.hasUserReviewed(requestServiceId, user.id);
  }
}
