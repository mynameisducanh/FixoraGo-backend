import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimestamp } from './base-timestamp';

@Entity('serviceReviews')
export class ServiceReview extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'idRequestService', type: 'uuid' })
  idRequestService: string;

  @Column({ name: 'rating', type: 'integer' })
  rating: number;

  @Column({ name: 'comment', type: 'text', nullable: true })
  comment: string;

  @Column({ name: 'type', type: 'text', nullable: true })
  type: string;

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @Column({ nullable: true })
  fixerId: string;

  @Column({ nullable: true })
  temp: string;
}
