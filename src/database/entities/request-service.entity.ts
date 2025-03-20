import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseTimestamp } from 'src/database/entities/base-timestamp';

export enum ServiceStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

@Entity('requestServices')
export class RequestServiceEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int', { name: 'userId', nullable: true })
  userId: number;

  @Column('int', { name: 'staffId', nullable: true })
  staffId: number;

  @Column({ name: 'nameService', nullable: true })
  nameService: string;

  @Column({ name: 'listDetailService', nullable: true })
  listDetailService: string;

  @Column({ name: 'priceService', nullable: true })
  priceService: string;

  @Column({ name: 'typeService', nullable: true })
  typeService: string;

  @Column('text', { name: 'note', nullable: true })
  note: string;

  @Column('varchar', { length: 50, nullable: true })
  status: ServiceStatus;
}
