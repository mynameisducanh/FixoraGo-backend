import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { WsException } from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit() {
    console.log('WebSocket Initialized');
  }

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    const role = client.handshake.query.role as string; // customer hoặc employee

    client.join(userId);
    console.log(`User connected: ${client.id}`);
    // console.log(`User connected: ${userId}, Role: ${role}`);
    client.broadcast.emit('user-join', {
      //chỉ hiện thị cho người ở room chat trc
      message: `New user join ${client.id}`,
    });
  }

  handleDisconnect(client: Socket) {
    // const userId = client.handshake.query.userId;
    console.log(`User disconnected: ${client.id}`);
    this.server.emit('user-left', {
      message: `User left the chat ${client.id}`,
    });
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('typeof data:', typeof data);
    // Nếu data là string, parse lại
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        throw new Error('Invalid JSON payload');
      }
    }

    console.log('Final parsed data:', data);

    if (!data.userId || !data.staffId) {
      throw new Error('userId and staffId are required');
    }

    const room = await this.chatService.createRoom({
      userId: data.userId,
      staffId: data.staffId,
    });

    client.join(room.data.id);
    client.join(room.data.id); // vẫn giữ nguyên
    this.server.to(room.data.id).emit('roomCreated', room);

    return room;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { roomId } = data;
    if (!roomId) throw new WsException('Missing roomId');
    client.join(roomId);
    client.emit('joinedRoom', { roomId });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    // Parse nếu là JSON string
    console.log(data);
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        throw new Error('Invalid JSON payload');
      }
    }
    console.log(data);

    const { roomId, senderId, senderName, receiverId, receiverName, content } =
      data;

    if (!roomId || !senderId || !receiverId || !content) {
      throw new Error('Missing required fields');
    }

    const room = await this.chatService.getRoomById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.status !== 'active') {
      throw new Error('Room is not active');
    }

    const savedMessage = await this.chatService.saveMessage({
      roomId,
      senderId,
      senderName,
      receiverId,
      receiverName,
      content,
    });

    this.server.to(roomId).emit('newMessage', {
      senderId,
      senderName,
      receiverId,
      receiverName,
      content,
    });
  }

  @SubscribeMessage('closeRoom')
  async handleCloseRoom(@MessageBody() data: any) {
    const { roomId } = data;
    const room = await this.chatService.closeRoom(roomId);
    this.server.to(roomId).emit('roomClosed', room);
  }
}
