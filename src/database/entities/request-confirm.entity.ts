import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseTimestamp } from 'src/database/entities/base-timestamp';

export enum ConfirmStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('requestConfirms')
export class RequestConfirmEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'userId', nullable: true })
  userId: string;

  @Column('varchar', { name: 'staffId', nullable: true })
  staffId: string;

  @Column('varchar', { name: 'requestServiceId', nullable: true })
  requestServiceId: string;

  @Column('varchar', { name: 'proposedPrice', nullable: true })
  proposedPrice: string;

  @Column('varchar', { name: 'negotiatedPrice', nullable: true })
  negotiatedPrice: string;

  @Column('tinyint', { name: 'StaffVerified', nullable: true })
  staffVerified: number;

  @Column('tinyint', { name: 'UserVerified', nullable: true })
  userVerified: number;

  @Column('text', { name: 'userNote', nullable: true })
  userNote: string;

  @Column('text', { name: 'staffNote', nullable: true })
  staffNote: string;

  @Column('varchar', { length: 50, default: ConfirmStatus.PENDING })
  status: ConfirmStatus;
}
