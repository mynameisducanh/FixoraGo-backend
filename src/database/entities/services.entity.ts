import { Entity, PrimaryColumn, Column } from 'typeorm';
import { BaseTimestamp } from 'src/database/entities/base-timestamp';

@Entity('services')
export class ServicesEntity extends BaseTimestamp {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar', { name: 'category_id' })
  categoryId: string;

  @Column('varchar')
  name: string;

  @Column('text')
  description: string;

  @Column('int')
  duration: number;

  @Column('int', { name: 'total_usage', default: 0 })
  totalUsage: number;

  @Column('int', { name: 'total_views', default: 0 })
  totalViews: number;

  @Column('float', { default: 0 })
  rating: number;

  @Column('int', { name: 'total_reviews', default: 0 })
  totalReviews: number;

  @Column('varchar', { name: 'image_url', nullable: true })
  imageUrl: string;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;
}
