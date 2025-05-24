import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RoomStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  INACTIVE = 'inactive',
}

@Exclude()
@Entity('chat-room')
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  staffId: string;

  @Column({
    default: RoomStatus.ACTIVE,
  })
  status: RoomStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
