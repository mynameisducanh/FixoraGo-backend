import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Exclude()
@Entity('chat-message')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  roomId: string;

  @Column({ type: 'varchar' })
  senderId: string;

  @Column({ type: 'varchar' })
  senderName: string;

  @Column({ type: 'varchar' })
  receiverId: string;

  @Column({ type: 'varchar' })
  receiverName: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
