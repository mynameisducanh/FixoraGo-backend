import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimestamp } from './base-timestamp';

@Entity('service_reviews')
export class ServiceReview extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_request_service', type: 'uuid' })
  idRequestService: string;

  @Column({ name: 'rating', type: 'int' })
  rating: number;

  @Column({ name: 'comment', type: 'text', nullable: true })
  comment: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;
} 