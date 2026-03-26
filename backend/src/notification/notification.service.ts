import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../database/entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
  ) {}

  async list(userId: number, page = 1, limit = 20, type?: string) {
    const where: any = { userId };
    if (type) where.type = type;

    const [data, total] = await this.notificationRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page };
  }

  async markAsRead(id: number, userId: number) {
    const notification = await this.notificationRepo.findOne({ where: { id } });
    if (!notification) throw new NotFoundException('通知不存在');
    if (notification.userId !== userId) throw new ForbiddenException('无权操作');

    await this.notificationRepo.update(id, { isRead: 1 });
    return { message: '已读' };
  }

  async markAllAsRead(userId: number) {
    await this.notificationRepo.update({ userId, isRead: 0 }, { isRead: 1 });
    return { message: '全部已读' };
  }
}
