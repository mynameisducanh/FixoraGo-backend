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
  export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    constructor(private readonly chatService: ChatService) {}
  
    afterInit() {
      console.log('WebSocket Initialized');
    }
  
    async handleConnection(client: Socket) {
      const userId = client.handshake.query.userId as string;
      const role = client.handshake.query.role as string; // customer hoặc employee
  
      client.join(userId);
      console.log(`User connected: ${userId}, Role: ${role}`);
    }
  
    handleDisconnect(client: Socket) {
      const userId = client.handshake.query.userId;
      console.log(`User disconnected: ${userId}`);
    }
  
    @SubscribeMessage('createRoom')
    async handleCreateRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
      const { customerId, employeeId } = data;
      const room = await this.chatService.createRoom(customerId, employeeId);
      client.join(room.id);
      this.server.to(employeeId).emit('roomCreated', room);
      return room;
    }
  
    @SubscribeMessage('sendMessage')
    async handleMessage(@MessageBody() data: any) {
      const { roomId, senderId, senderName, receiverId, receiverName, content } = data;
  
      const message = await this.chatService.saveMessage(
        roomId,
        senderId,
        senderName,
        receiverId,
        receiverName,
        content,
      );
  
      this.server.to(roomId).emit('newMessage', message);
    }
  
    @SubscribeMessage('closeRoom')
    async handleCloseRoom(@MessageBody() data: any) {
      const { roomId } = data;
      const room = await this.chatService.closeRoom(roomId);
      this.server.to(roomId).emit('roomClosed', room);
    }
  }
  