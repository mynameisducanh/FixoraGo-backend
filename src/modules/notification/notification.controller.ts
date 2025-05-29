import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuth } from 'src/common/decorators/jwt-auth.decorator'; 
import { User } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return await this.notificationService.create(createNotificationDto);
  }

  @Get()
  @JwtAuth()
  async findAll(
    @User() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    console.log(user)
    return await this.notificationService.findAll(user.id, page, limit);
  }

  @Get('unread/count')
  async getUnreadCount(@User() user: JwtPayload,) {
    return await this.notificationService.getUnreadCount(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: JwtPayload,) {
    return await this.notificationService.findOne(id, user.id);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @User() user: JwtPayload,) {
    return await this.notificationService.markAsRead(id, user.id);
  }

  @Patch('read-all')
  async markAllAsRead(@User() user: JwtPayload,) {
    return await this.notificationService.markAllAsRead(user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: JwtPayload,) {
    return await this.notificationService.remove(id, user.id);
  }
} 