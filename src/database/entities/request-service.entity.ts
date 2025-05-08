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

  @Column('uuid', { name: 'userId', nullable: true })
  userId: string;

  @Column('uuid', { name: 'fixerId', nullable: true })
  fixerId: string;

  @Column('varchar', { name: 'nameService', nullable: true })
  nameService: string;

  @Column('text', { name: 'listDetailService', nullable: true })
  listDetailService: string;

  @Column('varchar', { name: 'priceService', nullable: true })
  priceService: string;

  @Column('varchar', { name: 'fileImage', nullable: true })
  fileImage: string;

  @Column('varchar', { name: 'typeEquipment', nullable: true })
  typeEquipment: string;

  @Column('text', { name: 'address', nullable: true })
  address: string;

  @Column('varchar', { name: 'calender', nullable: true })
  calender: string;

  @Column('text', { name: 'note', nullable: true })
  note: string;

  @Column('varchar', { length: 50, nullable: true })
  status: ServiceStatus;

  @Column({ nullable: true })
  temp: string;
}
