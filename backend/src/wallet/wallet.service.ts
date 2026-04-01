import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WalletEntity } from '../database/entities/wallet.entity';
import { WithdrawalEntity } from '../database/entities/withdrawal.entity';
import { BankCardEntity } from '../database/entities/bank-card.entity';
import { WalletTransactionEntity } from '../database/entities/wallet-transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
    @InjectRepository(WithdrawalEntity)
    private readonly withdrawalRepo: Repository<WithdrawalEntity>,
    @InjectRepository(BankCardEntity)
    private readonly bankCardRepo: Repository<BankCardEntity>,
    @InjectRepository(WalletTransactionEntity)
    private readonly transactionRepo: Repository<WalletTransactionEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async getWallet(userId: number) {
    const wallet = await this.walletRepo.findOne({ where: { userId } });
    return wallet || { balance: 0, frozen: 0, totalEarn: 0 };
  }

  async withdraw(userId: number, amount: number, method?: string) {
    if (!amount || amount <= 0) throw new BadRequestException('提现金额无效');
    if (amount < 10) throw new BadRequestException('最低提现金额为 10 元');

    const withdrawMethod = method === 'alipay' ? 'alipay' : 'bank';

    let bankCard = null;
    if (withdrawMethod === 'bank') {
      bankCard = await this.bankCardRepo.findOne({
        where: { userId, isDefault: 1, status: 1 },
      });
    }

    return this.dataSource.transaction(async (manager) => {
      const wallet = await manager.findOne(WalletEntity, { where: { userId } });
      if (!wallet || Number(wallet.balance) < amount) {
        throw new BadRequestException('余额不足');
      }

      const newBalance = Number(wallet.balance) - amount;

      await manager.update(WalletEntity, { userId }, {
        balance: () => `balance - ${amount}`,
        frozen: () => `frozen + ${amount}`,
      });

      const withdrawal = await manager.save(
        WithdrawalEntity,
        manager.create(WithdrawalEntity, {
          userId,
          amount,
          method: withdrawMethod,
          bankCardId: bankCard?.id ?? null,
          bankName: bankCard?.bankName ?? null,
          bankAccount: bankCard?.cardNo ?? null,
          realName: bankCard?.realName ?? null,
        }),
      );

      await manager.save(
        WalletTransactionEntity,
        manager.create(WalletTransactionEntity, {
          userId,
          type: 'expense',
          amount,
          name: '申请提现',
          refType: 'withdrawal',
          refId: withdrawal.id,
          balanceAfter: newBalance,
        }),
      );

      return { message: '提现申请已提交，预计 1-3 个工作日到账' };
    });
  }

  async getBankCards(userId: number) {
    const data = await this.bankCardRepo.find({
      where: { userId, status: 1 },
      select: ['id', 'bankName', 'lastFour', 'realName', 'isDefault'],
      order: { isDefault: 'DESC', createdAt: 'ASC' },
    });
    return { data };
  }

  async getDefaultBankCard(userId: number) {
    const card = await this.bankCardRepo.findOne({
      where: { userId, isDefault: 1, status: 1 },
      select: ['bankName', 'lastFour'],
    });
    return card ?? null;
  }

  async getTransactions(userId: number, page = 1, limit = 20) {
    const [data, total] = await this.transactionRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      select: ['id', 'type', 'amount', 'name', 'createdAt'],
    });
    return { data, total };
  }
}
