import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ServiceReviewService } from './service-review.service';
import { CreateServiceReviewDto } from './dto/create-service-review.dto';
import { JwtAuth } from '../../common/decorators/jwt-auth.decorator';
import { User } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Service Reviews')
@Controller('service-reviews')
export class ServiceReviewController {
  constructor(private readonly serviceReviewService: ServiceReviewService) {}

  @Post()
  @JwtAuth()
  @ApiOperation({ summary: 'Create a new service review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
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
    return await this.serviceReviewService.getReviewsByFixerId(fixerId);
  }

  @Get('fixer/:fixerId/average')
  @ApiOperation({ summary: 'Get average rating for a fixer' })
  @ApiResponse({
    status: 200,
    description: 'Return average rating for the specified fixer',
  })
  async getAverageRatingForFixer(@Param('fixerId') fixerId: string) {
    return await this.serviceReviewService.getAverageRatingForFixer(fixerId);
  }
}
