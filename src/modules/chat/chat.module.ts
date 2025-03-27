import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from 'src/modules/chat/chat.gateway'; 
import { ChatService } from './chat.service';
import { ChatRoom } from 'src/database/entities/chat-room.entity'; 
import { ChatMessage } from 'src/database/entities/chat-message.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, ChatMessage])],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
