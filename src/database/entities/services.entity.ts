import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimestamp } from 'src/database/entities/base-timestamp';

@Entity('services')
export class ServicesEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'category_id', nullable: true })
  categoryId: string;

  @Column({
    nullable: true,
    name: 'Name',
    type: 'varchar'
  })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('integer', { nullable: true })
  duration: number;

  @Column('integer', { name: 'total_usage', default: 0, nullable: true })
  totalUsage: number;

  @Column('integer', { name: 'total_views', default: 0, nullable: true })
  totalViews: number;

  @Column('float', { default: 0, nullable: true })
  rating: number;

  @Column('integer', { name: 'total_reviews', default: 0, nullable: true })
  totalReviews: number;

  @Column('varchar', { name: 'image_url', nullable: true })
  imageUrl: string;

  @Column('boolean', { name: 'is_active', default: true, nullable: true })
  isActive: boolean;
}
