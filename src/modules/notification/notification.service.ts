import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotificationEntity,
  NotificationStatus,
} from '../../database/entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
      userId: createNotificationDto.userId,
    });
    return await this.notificationRepository.save(notification);
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: NotificationEntity[]; total: number }> {
    const [data, total] = await this.notificationRepository.findAndCount({
      where: { userId: userId, isDeleted: false },
      order: { createAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findOne(id: string, userId: string): Promise<NotificationEntity> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId: userId, isDeleted: false },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async markAsRead(id: string, userId: string): Promise<NotificationEntity> {
    const notification = await this.findOne(id, userId);
    notification.status = NotificationStatus.READ;
    notification.readAt = new Date();
    return await this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId: userId, status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ, readAt: new Date() },
    );
  }

  async remove(id: string, userId: string): Promise<void> {
    const notification = await this.findOne(id, userId);
    notification.isDeleted = true;
    await this.notificationRepository.save(notification);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepository.count({
      where: {
        userId: userId,
        status: NotificationStatus.UNREAD,
        isDeleted: false,
      },
    });
  }
}
