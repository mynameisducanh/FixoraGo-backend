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
    user: JwtPayload,
  ): Promise<ServiceReview> {
    const review = this.serviceReviewRepository.create({
      ...createServiceReviewDto,
      userId: user.id,
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

  async getAverageRatingForFixer(fixerId: string): Promise<number> {
    const result = await this.serviceReviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .where('review.fixerId = :fixerId', { fixerId })
      .getRawOne();

    return result.average || 0;
  }
}
