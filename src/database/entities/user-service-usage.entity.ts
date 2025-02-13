import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('UserServiceUsage')
export class UserServiceUsageEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column('varchar', { name: 'UserId', nullable: true })
  userId: string;

  @Column('varchar', { name: 'ServiceId', nullable: true })
  serviceId: string;

  @Column('int', { name: 'UsageCount', default: 0, nullable: true })
  usageCount: number;

  @Column('bigint', { name: 'LastUsedAt', nullable: true })
  lastUsedAt: number;
}
