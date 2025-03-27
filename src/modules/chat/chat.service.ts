import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom, RoomStatus } from 'src/database/entities/chat-room.entity';
import { ChatMessage } from 'src/database/entities/chat-message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private roomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private messageRepository: Repository<ChatMessage>,
  ) {}

  async createRoom(userId: string, staffId: string): Promise<ChatRoom> {
    const room = this.roomRepository.create({ userId, staffId });
    return this.roomRepository.save(room);
  }

  async closeRoom(roomId: string): Promise<ChatRoom> {
    const room = await this.roomRepository.findOne({ id: roomId });
    if (room) {
      room.status = RoomStatus.CLOSED;
      return await this.roomRepository.save(room);
    }
    throw new Error('Room not found');
  }

  async saveMessage(
    roomId: string,
    senderId: string,
    senderName: string,
    receiverId: string,
    receiverName: string,
    content: string,
  ): Promise<ChatMessage> {
    const room = await this.roomRepository.findOne({ id: roomId });
    if (!room || room.status === RoomStatus.CLOSED) {
      throw new Error('Room is closed or does not exist');
    }

    const message = this.messageRepository.create({
      roomId,
      senderId,
      senderName,
      receiverId,
      receiverName,
      content,
    });

    return this.messageRepository.save(message);
  }

  async getMessagesByRoom(roomId: string): Promise<ChatMessage[]> {
    return this.messageRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
    });
  }
}
