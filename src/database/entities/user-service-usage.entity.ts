import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('UserServiceUsage')
export class UserServiceUsageEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'Id' })
  id: string;

  @Column('uuid', { name: 'UserId', nullable: true })
  userId: string;

  @Column('uuid', { name: 'ServiceId', nullable: true })
  serviceId: string;

  @Column('integer', { name: 'UsageCount', default: 0, nullable: true })
  usageCount: number;

  @Column('bigint', { name: 'LastUsedAt', nullable: true })
  lastUsedAt: number;
}
