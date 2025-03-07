import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimestamp } from 'src/database/entities/base-timestamp';

@Entity('services')
export class ServicesEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'category_id', nullable: true })
  categoryId: string;

  @Column({
    nullable: true,
    name: 'Name',
  })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('int', { nullable: true })
  duration: number;

  @Column('int', { name: 'total_usage', default: 0, nullable: true })
  totalUsage: number;

  @Column('int', { name: 'total_views', default: 0, nullable: true })
  totalViews: number;

  @Column('float', { default: 0, nullable: true })
  rating: number;

  @Column('int', { name: 'total_reviews', default: 0, nullable: true })
  totalReviews: number;

  @Column('varchar', { name: 'image_url', nullable: true })
  imageUrl: string;

  @Column('boolean', { name: 'is_active', default: true, nullable: true })
  isActive: boolean;
}
