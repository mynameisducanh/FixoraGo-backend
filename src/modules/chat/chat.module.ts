import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway'; 
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRoom } from '../../database/entities/chat-room.entity'; 
import { ChatMessage } from '../../database/entities/chat-message.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, ChatMessage])],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
