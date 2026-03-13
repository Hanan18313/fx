import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../database/entities/user.entity';

@Injectable()
export class UserMgmtService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async list(params: {
    page: number;
    pageSize: number;
    phone?: string;
    nickname?: string;
    role?: string;
    status?: number;
  }) {
    const { page, pageSize, phone, nickname, role, status } = params;
    const qb = this.userRepo.createQueryBuilder('u');

    if (phone) {
      qb.andWhere('u.phone LIKE :phone', { phone: `%${phone}%` });
    }
    if (nickname) {
      qb.andWhere('u.nickname LIKE :nickname', { nickname: `%${nickname}%` });
    }
    if (role) {
      qb.andWhere('u.role = :role', { role });
    }
    if (status !== undefined) {
      qb.andWhere('u.status = :status', { status });
    }

    qb.select([
      'u.id',
      'u.phone',
      'u.nickname',
      'u.avatar',
      'u.role',
      'u.inviteCode',
      'u.parentId',
      'u.status',
      'u.createdAt',
      'u.updatedAt',
    ]);

    qb.orderBy('u.createdAt', 'DESC');

    const total = await qb.getCount();
    const list = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return { list, total, page, pageSize };
  }

  async update(id: number, data: { status?: number; role?: string }) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    const updateData: Partial<UserEntity> = {};
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.role !== undefined) {
      updateData.role = data.role;
    }

    await this.userRepo.update(id, updateData);
    return { message: '更新成功' };
  }
}
