import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuth } from 'src/common/decorators/jwt-auth.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('room/:id')
  @ApiOperation({ summary: 'Lấy chi tiết phòng chat và tin nhắn' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin phòng chat thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phòng chat' })
  async getRoomDetail(@Param('id') id: string) {
    return await this.chatService.getRoomDetail(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy danh sách phòng chat của người dùng' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách phòng chat thành công' })
  async getRoomsByUserId(@Param('userId') userId: string) {
    return await this.chatService.getRoomsByUserId(userId);
  }

  @Get('fixer/:fixerId')
  @ApiOperation({ summary: 'Lấy danh sách phòng chat của nhân viên' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách phòng chat thành công' })
  async getRoomsByFixerId(@Param('fixerId') fixerId: string) {
    return await this.chatService.getRoomsByFixerId(fixerId);
  }
}
