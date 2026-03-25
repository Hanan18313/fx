import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PromotionRewardEntity } from '../database/entities/promotion-reward.entity';
import { UserEntity } from '../database/entities/user.entity';
import { WalletEntity } from '../database/entities/wallet.entity';
import { PromotionConfigService } from './promotion-config.service';

@Injectable()
export class PromotionService {
  private readonly logger = new Logger(PromotionService.name);

  constructor(
    @InjectRepository(PromotionRewardEntity)
    private readonly rewardRepo: Repository<PromotionRewardEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly dataSource: DataSource,
    private readonly configService: PromotionConfigService,
  ) {}

  /**
   * 邀请注册奖励：注册成功后调用，不阻塞注册流程
   */
  async grantReferralReward(parentId: number, fromUserId: number): Promise<void> {
    const enabled = await this.configService.getBoolConfig('referral_reward_enabled', true);
    if (!enabled) return;

    const parent = await this.userRepo.findOne({ where: { id: parentId } });
    if (!parent || parent.status !== 1) return;

    const existing = await this.rewardRepo.findOne({
      where: { userId: parentId, fromUserId, type: 'referral' },
    });
    if (existing) return;

    const amount = await this.configService.getNumberConfig('referral_reward_amount', 5);

    await this.dataSource.transaction(async (manager) => {
      await manager.save(PromotionRewardEntity, manager.create(PromotionRewardEntity, {
        userId: parentId,
        fromUserId,
        type: 'referral',
        amount,
      }));

      await manager.query(
        `UPDATE wallets SET balance = balance + ?, total_earn = total_earn + ? WHERE user_id = ?`,
        [amount, amount, parentId],
      );
    });

    this.logger.log(`邀请奖励发放: 推荐人=${parentId}, 新用户=${fromUserId}, 金额=${amount}`);
  }

  /**
   * 分享订单佣金：在 payOrder 事务中同步调用
   * 传入 EntityManager 以保证事务一致性
   */
  async grantCommission(
    parentId: number,
    fromUserId: number,
    orderId: number,
    profitPool: number,
    manager?: import('typeorm').EntityManager,
  ): Promise<void> {
    const enabled = await this.configService.getBoolConfig('commission_enabled', true);
    if (!enabled) return;

    const parent = await this.userRepo.findOne({ where: { id: parentId } });
    if (!parent || parent.status !== 1) return;

    const existing = await this.rewardRepo.findOne({
      where: { userId: parentId, fromUserId, type: 'commission', orderId },
    });
    if (existing) return;

    const rate = await this.configService.getNumberConfig('commission_rate', 0.05);
    const amount = +(profitPool * rate).toFixed(4);
    if (amount <= 0) return;

    const em = manager || this.dataSource.manager;

    await em.save(PromotionRewardEntity, em.create(PromotionRewardEntity, {
      userId: parentId,
      fromUserId,
      orderId,
      type: 'commission',
      amount,
    }));

    await em.query(
      `UPDATE wallets SET balance = balance + ?, total_earn = total_earn + ? WHERE user_id = ?`,
      [amount, amount, parentId],
    );

    this.logger.log(`佣金发放: 推荐人=${parentId}, 订单=${orderId}, 金额=${amount}`);
  }

  async getStats(userId: number) {
    const inviteCount = await this.userRepo.count({ where: { parentId: userId } });

    const [result] = await this.dataSource.query(
      `SELECT
         COALESCE(SUM(CASE WHEN type='referral' THEN amount ELSE 0 END), 0) AS referral_total,
         COALESCE(SUM(CASE WHEN type='commission' THEN amount ELSE 0 END), 0) AS commission_total,
         COALESCE(SUM(amount), 0) AS total_reward
       FROM promotion_rewards WHERE user_id = ?`,
      [userId],
    );

    return {
      invite_count: inviteCount,
      referral_total: Number(result.referral_total),
      commission_total: Number(result.commission_total),
      total_reward: Number(result.total_reward),
    };
  }

  async getInvitees(userId: number, page = 1, limit = 20) {
    const [data, total] = await this.userRepo.findAndCount({
      where: { parentId: userId },
      select: ['nickname', 'avatar', 'createdAt'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page };
  }

  async getRewards(userId: number, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const data = await this.dataSource.query(
      `SELECT pr.type, pr.amount, pr.created_at,
              u.nickname AS from_nickname
       FROM promotion_rewards pr
       LEFT JOIN users u ON u.id = pr.from_user_id
       WHERE pr.user_id = ?
       ORDER BY pr.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset],
    );
    const [{ cnt }] = await this.dataSource.query(
      `SELECT COUNT(*) AS cnt FROM promotion_rewards WHERE user_id = ?`,
      [userId],
    );
    return { data, total: Number(cnt), page };
  }
}
