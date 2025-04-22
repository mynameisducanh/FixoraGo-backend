import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimestamp } from 'src/database/entities/base-timestamp';

export enum ServiceType {
  REPAIR = 'repair',
  REPLACE = 'replace',
}

@Entity('requestConfirmServices')
export class RequestConfirmServiceEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'requestConfirmId', nullable: false })
  requestConfirmId: string;

  @Column('varchar', { name: 'name', nullable: false })
  name: string;

  @Column('varchar', { name: 'type', nullable: false })
  type: ServiceType;

  @Column('varchar', { name: 'price', nullable: false })
  price: string;

  @Column('varchar', { name: 'image', nullable: true })
  image: string;

  @Column('text', { name: 'note', nullable: true })
  note: string;
} 