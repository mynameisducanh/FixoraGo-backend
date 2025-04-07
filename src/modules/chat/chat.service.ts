import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom, RoomStatus } from 'src/database/entities/chat-room.entity';
import { ChatMessage } from 'src/database/entities/chat-message.entity';
import { CreateChatRoomDto } from 'src/modules/chat/dto/create-room.dto';
import { DataResponse, MessageResponse } from 'src/common/types/response';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private roomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private messageRepository: Repository<ChatMessage>,
  ) {}

  async createRoom(body: CreateChatRoomDto): Promise<DataResponse<ChatRoom>> {
    const existingRoom = {
      userId: body.userId,
      staffId: body.staffId,
      status: RoomStatus.ACTIVE,
    };
    const data = await this.roomRepository.save(existingRoom);
    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'Tạo chat room thành công',
    };
  }
  async getRoomById(roomId: string): Promise<ChatRoom> {
    return this.roomRepository.findOne({ where: { id: roomId } });
  }
  
  async saveMessage(messageDto: {
    roomId: string;
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    content: string;
  }): Promise<ChatMessage> {
    const message = this.messageRepository.create(messageDto);
    return this.messageRepository.save(message);
  }
  
  async closeRoom(roomId: string): Promise<ChatRoom> {
    const room = await this.roomRepository.findOne({ id: roomId });
    if (room) {
      room.status = RoomStatus.CLOSED;
      return await this.roomRepository.save(room);
    }
    throw new Error('Room not found');
  }
  async getMessagesByRoom(roomId: string): Promise<ChatMessage[]> {
    return this.messageRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
    });
  }
}
