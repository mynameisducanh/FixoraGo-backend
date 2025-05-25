import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceReview } from '../../database/entities/service-review.entity';
import { CreateServiceReviewDto } from './dto/create-service-review.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class ServiceReviewService {
  constructor(
    @InjectRepository(ServiceReview)
    private readonly serviceReviewRepository: Repository<ServiceReview>,
    private readonly usersService: UsersService,
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

    // If there's a fixerId, update their InfoVerified score based on rating
    if (createServiceReviewDto.fixerId) {
      let points = 0;
      switch (createServiceReviewDto.rating) {
        case 5:
          points = 2;
          break;
        case 4:
          points = 1;
          break;
        case 2:
          points = -1;
          break;
        case 1:
          points = -3;
          break;
        default:
          points = 0;
      }

      if (points !== 0) {
        await this.usersService.updateInfoVerifiedScore(
          createServiceReviewDto.fixerId,
          Math.abs(points),
          points > 0 ? 'add' : 'subtract'
        );
      }
    }

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

  async getReviewsByUserId(userId: string): Promise<any[]> {
    const reviews = await this.serviceReviewRepository.find({
      where: { userId },
      order: { createAt: 'DESC' },
    });

    // Get fixer information for each review
    const reviewsWithFixerInfo = await Promise.all(
      reviews.map(async (review) => {
        if (review.fixerId) {
          const fixerInfo = await this.usersService.getUserNameById(review.fixerId);
          return {
            ...review,
            senderId: review.fixerId,
            senderFullName: fixerInfo.fullName,
            senderUsername: fixerInfo.username,
            senderAvatarUrl: fixerInfo.avatarUrl
          };
        }
        return review;
      })
    );

    return reviewsWithFixerInfo;
  }

  async getReviewsByFixerId(fixerId: string): Promise<any[]> {
    const reviews = await this.serviceReviewRepository.find({
      where: { fixerId },
      order: { createAt: 'DESC' },
    });

    // Get user information for each review
    const reviewsWithUserInfo = await Promise.all(
      reviews.map(async (review) => {
        const userInfo = await this.usersService.getUserNameById(review.userId);
        return {
          ...review,
          senderId: review.userId,
          senderFullName: userInfo.fullName,
          senderUsername: userInfo.username,
          senderAvatarUrl: userInfo.avatarUrl,
        };
      })
    );

    return reviewsWithUserInfo;
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
