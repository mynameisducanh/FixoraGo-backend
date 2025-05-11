import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseTimestamp } from './base-timestamp';

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  ORDER = 'ORDER',
  PAYMENT = 'PAYMENT',
  PROMOTION = 'PROMOTION',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
  FIXER_SERVICE = 'FIXER_SERVICE',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
}

@Entity('notifications')
export class NotificationEntity extends BaseTimestamp{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: NotificationType.SYSTEM,
  })
  type: NotificationType;

  @Column({
    default: NotificationPriority.MEDIUM,
  })
  priority: NotificationPriority;

  @Column({
    default: NotificationStatus.UNREAD,
  })
  status: NotificationStatus;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  actionUrl: string;

  @Column({ nullable: true })
  metadata: string;

  @Column()
  userId: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  readAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;
}
