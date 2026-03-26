import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../../../database/entities/notification.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationMgmtService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notifRepo: Repository<NotificationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async list(params: {
    page: number;
    pageSize: number;
    type?: string;
  }) {
    const { page, pageSize, type } = params;

    const qb = this.notifRepo
      .createQueryBuilder('n')
      .leftJoin('users', 'u', 'u.id = n.user_id')
      .addSelect(['u.phone AS userPhone']);

    if (type) {
      qb.andWhere('n.type = :type', { type });
    }

    qb.orderBy('n.created_at', 'DESC');

    const total = await qb.getCount();

    const raw = await qb
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .getRawAndEntities();

    const list = raw.entities.map((notif, idx) => ({
      ...notif,
      userPhone: raw.raw[idx]?.userPhone ?? null,
    }));

    return { list, total, page, pageSize };
  }

  async create(dto: CreateNotificationDto) {
    if (dto.userId === 0) {
      const users = await this.userRepo.find({ select: ['id'] });
      const entities = users.map((u) =>
        this.notifRepo.create({
          userId: u.id,
          type: dto.type,
          title: dto.title,
          content: dto.content,
        }),
      );
      await this.notifRepo.save(entities);
      return { message: `已向 ${entities.length} 位用户发送通知` };
    }

    const entity = this.notifRepo.create(dto);
    await this.notifRepo.save(entity);
    return { message: '发送成功' };
  }

  async remove(id: number) {
    await this.notifRepo.delete(id);
    return { message: '删除成功' };
  }
}
