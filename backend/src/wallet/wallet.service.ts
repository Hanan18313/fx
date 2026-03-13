import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WalletEntity } from '../database/entities/wallet.entity';
import { WithdrawalEntity } from '../database/entities/withdrawal.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
    @InjectRepository(WithdrawalEntity)
    private readonly withdrawalRepo: Repository<WithdrawalEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async getWallet(userId: number) {
    const wallet = await this.walletRepo.findOne({ where: { userId } });
    return wallet || { balance: 0, frozen: 0, totalEarn: 0 };
  }

  async withdraw(userId: number, amount: number) {
    if (!amount || amount <= 0) throw new BadRequestException('提现金额无效');

    return this.dataSource.transaction(async (manager) => {
      const wallet = await manager.findOne(WalletEntity, { where: { userId } });
      if (!wallet || Number(wallet.balance) < amount) {
        throw new BadRequestException('余额不足');
      }

      await manager.update(WalletEntity, { userId }, {
        balance: () => `balance - ${amount}`,
        frozen: () => `frozen + ${amount}`,
      });

      await manager.save(WithdrawalEntity, manager.create(WithdrawalEntity, { userId, amount }));

      return { message: '提现申请已提交，预计 1-3 个工作日到账' };
    });
  }

  async getTransactions(userId: number) {
    const profits = await this.dataSource.query(
      `SELECT 'profit' AS type, amount, released_at AS date FROM profit_records
       WHERE user_id = ? ORDER BY released_at DESC LIMIT 50`,
      [userId],
    );
    const withdrawals = await this.dataSource.query(
      `SELECT 'withdraw' AS type, amount, applied_at AS date FROM withdrawals
       WHERE user_id = ? ORDER BY applied_at DESC LIMIT 50`,
      [userId],
    );
    const data = [...profits, ...withdrawals].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return { data };
  }
}
