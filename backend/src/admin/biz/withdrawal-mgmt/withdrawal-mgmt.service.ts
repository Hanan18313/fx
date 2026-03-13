import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WithdrawalEntity } from '../../../database/entities/withdrawal.entity';
import { WalletEntity } from '../../../database/entities/wallet.entity';

@Injectable()
export class WithdrawalMgmtService {
  constructor(
    @InjectRepository(WithdrawalEntity)
    private readonly withdrawalRepo: Repository<WithdrawalEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async list(params: {
    page: number;
    pageSize: number;
    status?: string;
    userId?: number;
  }) {
    const { page, pageSize, status, userId } = params;

    const qb = this.withdrawalRepo
      .createQueryBuilder('w')
      .leftJoin('users', 'u', 'u.id = w.user_id')
      .addSelect(['u.phone AS userPhone']);

    if (status) {
      qb.andWhere('w.status = :status', { status });
    }
    if (userId) {
      qb.andWhere('w.user_id = :userId', { userId });
    }

    qb.orderBy('w.applied_at', 'DESC');

    const total = await qb.getCount();

    const raw = await qb
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .getRawAndEntities();

    const list = raw.entities.map((withdrawal, idx) => ({
      ...withdrawal,
      userPhone: raw.raw[idx]?.userPhone ?? null,
    }));

    return { list, total, page, pageSize };
  }

  async approve(id: number) {
    const withdrawal = await this.withdrawalRepo.findOneBy({ id });
    if (!withdrawal) {
      throw new BadRequestException('提现记录不存在');
    }
    if (withdrawal.status !== 'pending') {
      throw new BadRequestException('该提现申请已处理');
    }

    await this.dataSource.transaction(async (manager) => {
      // Update withdrawal status
      await manager.update(WithdrawalEntity, id, {
        status: 'approved',
        processedAt: new Date(),
      });

      // Deduct from frozen amount (money goes out)
      await manager
        .createQueryBuilder()
        .update(WalletEntity)
        .set({
          frozen: () => `frozen - ${withdrawal.amount}`,
        })
        .where('user_id = :userId', { userId: withdrawal.userId })
        .execute();
    });

    return { message: '审批通过' };
  }

  async reject(id: number, rejectReason: string) {
    if (!rejectReason) {
      throw new BadRequestException('请填写拒绝原因');
    }

    const withdrawal = await this.withdrawalRepo.findOneBy({ id });
    if (!withdrawal) {
      throw new BadRequestException('提现记录不存在');
    }
    if (withdrawal.status !== 'pending') {
      throw new BadRequestException('该提现申请已处理');
    }

    await this.dataSource.transaction(async (manager) => {
      // Update withdrawal status
      await manager.update(WithdrawalEntity, id, {
        status: 'rejected',
        rejectReason,
        processedAt: new Date(),
      });

      // Move amount from frozen back to balance
      await manager
        .createQueryBuilder()
        .update(WalletEntity)
        .set({
          frozen: () => `frozen - ${withdrawal.amount}`,
          balance: () => `balance + ${withdrawal.amount}`,
        })
        .where('user_id = :userId', { userId: withdrawal.userId })
        .execute();
    });

    return { message: '已拒绝' };
  }
}
