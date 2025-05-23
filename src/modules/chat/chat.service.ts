import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom, RoomStatus } from '../../database/entities/chat-room.entity';
import { ChatMessage } from '../../database/entities/chat-message.entity';
import { CreateChatRoomDto } from './dto/create-room.dto';
import { DataResponse, MessageResponse } from '../../common/types/response';

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

  async getRoomDetail(roomId: string): Promise<DataResponse<{ room: ChatRoom; messages: ChatMessage[] }>> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Không tìm thấy phòng chat ');
    }

    const messages = await this.messageRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
    });

    return {
      data: { room, messages },
      statusCode: HttpStatus.OK,
      message: 'Lấy thông tin phòng chat thành công',
    };
  }

  async getRoomsByUserId(userId: string): Promise<DataResponse<ChatRoom[]>> {
    const rooms = await this.roomRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });

    return {
      data: rooms,
      statusCode: HttpStatus.OK,
      message: 'Lấy danh sách phòng chat thành công',
    };
  }

  async getRoomsByFixerId(fixerId: string): Promise<DataResponse<ChatRoom[]>> {
    const rooms = await this.roomRepository.find({
      where: { staffId: fixerId },
      order: { updatedAt: 'DESC' },
    });

    return {
      data: rooms,
      statusCode: HttpStatus.OK,
      message: 'Lấy danh sách phòng chat thành công',
    };
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
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (room) {
      room.status = RoomStatus.CLOSED;
      return await this.roomRepository.save(room);
    }
    throw new Error('Room not found');
  }

  async updateRoomStatusByUserAndFixer(
    userId: string,
    staffId: string,
  ): Promise<MessageResponse> {
    const room = await this.roomRepository.findOne({
      where: {
        userId,
        staffId,
        status: RoomStatus.ACTIVE,
      },
    });

    if (!room) {
      throw new NotFoundException('Không tìm thấy phòng chat');
    }

    room.status = RoomStatus.INACTIVE;
    await this.roomRepository.save(room);

    return {
      message: 'Cập nhật trạng thái phòng chat thành công',
      statusCode: HttpStatus.OK,
    };
  }

  async getMessagesByRoom(roomId: string): Promise<ChatMessage[]> {
    return this.messageRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
    });
  }
}
