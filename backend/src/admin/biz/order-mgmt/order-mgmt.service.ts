import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../../database/entities/order.entity';
import { OrderItemEntity } from '../../../database/entities/order-item.entity';

@Injectable()
export class OrderMgmtService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepo: Repository<OrderItemEntity>,
  ) {}

  async list(params: {
    page: number;
    pageSize: number;
    status?: string;
    userId?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const { page, pageSize, status, userId, startDate, endDate } = params;

    const qb = this.orderRepo
      .createQueryBuilder('o')
      .leftJoin('users', 'u', 'u.id = o.user_id')
      .addSelect(['u.phone AS userPhone', 'u.nickname AS userNickname']);

    if (status) {
      qb.andWhere('o.status = :status', { status });
    }
    if (userId) {
      qb.andWhere('o.user_id = :userId', { userId });
    }
    if (startDate) {
      qb.andWhere('o.created_at >= :startDate', { startDate });
    }
    if (endDate) {
      qb.andWhere('o.created_at <= :endDate', { endDate: `${endDate} 23:59:59` });
    }

    qb.orderBy('o.created_at', 'DESC');

    const total = await qb.getCount();

    const raw = await qb
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .getRawAndEntities();

    const list = raw.entities.map((order, idx) => ({
      ...order,
      userPhone: raw.raw[idx]?.userPhone ?? null,
      userNickname: raw.raw[idx]?.userNickname ?? null,
    }));

    return { list, total, page, pageSize };
  }

  async detail(id: number) {
    const order = await this.orderRepo.findOneBy({ id });
    if (!order) {
      throw new BadRequestException('订单不存在');
    }

    const items = await this.orderItemRepo.find({
      where: { orderId: id },
    });

    return { ...order, items };
  }

  async updateStatus(id: number, newStatus: string) {
    const order = await this.orderRepo.findOneBy({ id });
    if (!order) {
      throw new BadRequestException('订单不存在');
    }

    const allowedTransitions: Record<string, string[]> = {
      paid: ['shipped', 'cancelled'],
    };

    const allowed = allowedTransitions[order.status];
    if (!allowed || !allowed.includes(newStatus)) {
      throw new BadRequestException(
        `不允许从 ${order.status} 状态变更为 ${newStatus}`,
      );
    }

    await this.orderRepo.update(id, { status: newStatus });
    return { message: '状态更新成功' };
  }
}
