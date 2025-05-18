import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceReview } from '../../database/entities/service-review.entity';
import { CreateServiceReviewDto } from './dto/create-service-review.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class ServiceReviewService {
  constructor(
    @InjectRepository(ServiceReview)
    private readonly serviceReviewRepository: Repository<ServiceReview>,
  ) {}

  async createReview(
    createServiceReviewDto: CreateServiceReviewDto,
  ): Promise<ServiceReview> {
    const review = this.serviceReviewRepository.create({
      ...createServiceReviewDto,
      userId: createServiceReviewDto.userId,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
    });

    return await this.serviceReviewRepository.save(review);
  }

  async getReviewsByService(
    idRequestService: string,
  ): Promise<ServiceReview[]> {
    return await this.serviceReviewRepository.find({
      where: { idRequestService },
      order: { createAt: 'DESC' },
    });
  }

  async getReviewsByUserId(userId: string): Promise<ServiceReview[]> {
    return await this.serviceReviewRepository.find({
      where: { userId },
      order: { createAt: 'DESC' },
    });
  }

  async getReviewsByFixerId(fixerId: string): Promise<ServiceReview[]> {
    return await this.serviceReviewRepository.find({
      where: { fixerId },
      order: { createAt: 'DESC' },
    });
  }

  async getAverageRatingForFixer(fixerId: string): Promise<{ average: number; count: number }> {
    const result = await this.serviceReviewRepository
      .createQueryBuilder('review')
      .select('ROUND(AVG(review.rating)::numeric, 2)', 'average')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.fixerId = :fixerId', { fixerId })
      .getRawOne();

    return {
      average: parseFloat(result.average) || 0,
      count: parseInt(result.count) || 0
    };
  }

  async getReviewCountForFixer(fixerId: string): Promise<number> {
    const result = await this.serviceReviewRepository
      .createQueryBuilder('review')
      .select('COUNT(review.id)', 'count')
      .where('review.fixerId = :fixerId', { fixerId })
      .getRawOne();

    return parseInt(result.count) || 0;
  }

  async hasUserReviewed(requestServiceId: string, userId: string): Promise<{ hasReviewed: boolean; review?: ServiceReview }> {
    const review = await this.serviceReviewRepository.findOne({
      where: {
        idRequestService: requestServiceId,
        userId: userId
      }
    });

    return {
      hasReviewed: !!review,
      review: review || undefined
    };
  }
}
