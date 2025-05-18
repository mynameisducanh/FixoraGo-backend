import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimestamp } from 'src/database/entities/base-timestamp';

export enum ServiceType {
  REPAIR = 'repair',
  REPLACE = 'replace',
  TOTAL = 'total',
  GUARANTEE = 'guarantee',

}

@Entity('requestConfirmServices')
export class RequestConfirmServiceEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'requestServiceId', nullable: true })
  requestServiceId: string;

  @Column('varchar', { name: 'name', nullable: true })
  name: string;

  @Column('varchar', { name: 'userId', nullable: true })
  userId: string;

  @Column('varchar', { name: 'type', nullable: true })
  type: string;

  @Column('varchar', { name: 'price', nullable: true })
  price: string;

  @Column('varchar', { name: 'userAccept', nullable: true })
  userAccept: string;

  @Column('varchar', { nullable: true })
  status: string;

  @Column('varchar', { name: 'image', nullable: true })
  image: string;

  @Column('text', { name: 'note', nullable: true })
  note: string;

  @Column({ nullable: true })
  temp: string;
}
