import { Exclude } from 'class-transformer';
import { BaseTimestamp } from 'src/database/entities/base-timestamp';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
@Entity('RevenueManager')
export class RevenueManagerEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column('bigint', { nullable: true })
  expires: string;

  // Tổng doanh thu (tổng thu nhập của user)
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalRevenue: number;

  // Phí đã nộp
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  paidFees: number;

  // Phí chưa nộp
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  unpaidFees: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'varchar', default: 'active' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  temp: string;

  @Column({ type: 'varchar', nullable: true })
  activityId: string;
}
