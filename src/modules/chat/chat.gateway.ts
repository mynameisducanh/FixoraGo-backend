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
    // 👇 Nếu data là string, parse lại
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
    this.server.to(data.staffId).emit('roomCreated', room);
    return room;
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() message: string) {
    // const { roomId, senderId, senderName, receiverId, receiverName, content } = data;

    // const message = await this.chatService.saveMessage(
    //   roomId,
    //   senderId,
    //   senderName,
    //   receiverId,
    //   receiverName,
    //   content,
    // );

    // this.server.to(roomId).emit('newMessage', message);
    this.server.emit('message', message);
  }

  @SubscribeMessage('closeRoom')
  async handleCloseRoom(@MessageBody() data: any) {
    const { roomId } = data;
    const room = await this.chatService.closeRoom(roomId);
    this.server.to(roomId).emit('roomClosed', room);
  }
}
