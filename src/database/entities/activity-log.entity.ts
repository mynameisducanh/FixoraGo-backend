import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimestamp } from './base-timestamp';

export enum ActivityType {
  STAFF_CHECKIN = 'staff_checkin',
  STAFF_CANCEL = 'staff_cancel',
  USER_CANCEL = 'user_cancel',
  STAFF_PAYFEE = 'staff_payfee',
}

@Entity('activityLogs')
export class ActivityLogEntity extends BaseTimestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'activityType',
  })
  activityType: string;

  @Column({ name: 'fixerId', nullable: true })
  fixerId: string;

  @Column({ name: 'userId', nullable: true })
  userId: string;

  @Column({ name: 'requestServiceId', nullable: true })
  requestServiceId: string;

  @Column({ name: 'requestConfirmId', nullable: true })
  requestConfirmId: string;

  @Column({ type: 'text', name: 'note', nullable: true })
  note: string;

  @Column({ name: 'imageUrl', nullable: true })
  imageUrl: string;

  @Column({ type: 'text', name: 'address', nullable: true })
  address: string;

  @Column({ name: 'latitude', nullable: true })
  latitude: string;

  @Column({ name: 'longitude', nullable: true })
  longitude: string;

  @Column({ nullable: true })
  temp: string;
}
