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

  async getReviewsByService(idRequestService: string): Promise<ServiceReview[]> {
    return await this.serviceReviewRepository.find({
      where: { idRequestService },
      order: { createAt: 'DESC' },
    });
  }

  async getAverageRating(idRequestService: string): Promise<number> {
    const result = await this.serviceReviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .where('review.idRequestService = :idRequestService', { idRequestService })
      .getRawOne();

    return result.average || 0;
  }
} 