import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PromotionConfigService } from '../../../promotion/promotion-config.service';
import { UpdatePromotionConfigDto } from './dto/update-promotion-config.dto';

@Injectable()
export class PromotionMgmtService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: PromotionConfigService,
  ) {}

  async getOverview() {
    const [totals] = await this.dataSource.query(`
      SELECT
        COUNT(DISTINCT CASE WHEN type='referral' THEN from_user_id END) AS total_invites,
        COALESCE(SUM(CASE WHEN type='referral' THEN amount ELSE 0 END), 0) AS total_referral_amount,
        COALESCE(SUM(CASE WHEN type='commission' THEN amount ELSE 0 END), 0) AS total_commission_amount
      FROM promotion_rewards
    `);

    const [today] = await this.dataSource.query(`
      SELECT
        COUNT(DISTINCT CASE WHEN type='referral' THEN from_user_id END) AS today_invites,
        COALESCE(SUM(CASE WHEN type='referral' THEN amount ELSE 0 END), 0) AS today_referral_amount,
        COALESCE(SUM(CASE WHEN type='commission' THEN amount ELSE 0 END), 0) AS today_commission_amount
      FROM promotion_rewards
      WHERE DATE(created_at) = CURDATE()
    `);

    return {
      total_invites: Number(totals.total_invites),
      total_referral_amount: Number(totals.total_referral_amount),
      total_commission_amount: Number(totals.total_commission_amount),
      today_invites: Number(today.today_invites),
      today_referral_amount: Number(today.today_referral_amount),
      today_commission_amount: Number(today.today_commission_amount),
    };
  }

  async getRewards(page = 1, limit = 20, type?: string, startDate?: string, endDate?: string) {
    let where = 'WHERE 1=1';
    const params: any[] = [];

    if (type) {
      where += ' AND pr.type = ?';
      params.push(type);
    }
    if (startDate) {
      where += ' AND DATE(pr.created_at) >= ?';
      params.push(startDate);
    }
    if (endDate) {
      where += ' AND DATE(pr.created_at) <= ?';
      params.push(endDate);
    }

    const offset = (page - 1) * limit;
    const data = await this.dataSource.query(
      `SELECT pr.id, u.nickname AS user_name, fu.nickname AS from_user_name,
              pr.type, pr.amount, pr.order_id, pr.created_at
       FROM promotion_rewards pr
       LEFT JOIN users u ON u.id = pr.user_id
       LEFT JOIN users fu ON fu.id = pr.from_user_id
       ${where}
       ORDER BY pr.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    const [{ cnt }] = await this.dataSource.query(
      `SELECT COUNT(*) AS cnt FROM promotion_rewards pr ${where}`,
      params,
    );

    return { data, total: Number(cnt), page };
  }

  async getConfig() {
    return this.configService.getAllConfigs();
  }

  async updateConfig(dto: UpdatePromotionConfigDto) {
    if (dto.referral_reward_amount !== undefined) {
      await this.configService.setConfig('referral_reward_amount', String(dto.referral_reward_amount));
    }
    if (dto.commission_rate !== undefined) {
      await this.configService.setConfig('commission_rate', String(dto.commission_rate));
    }
    if (dto.referral_reward_enabled !== undefined) {
      await this.configService.setConfig('referral_reward_enabled', String(dto.referral_reward_enabled));
    }
    if (dto.commission_enabled !== undefined) {
      await this.configService.setConfig('commission_enabled', String(dto.commission_enabled));
    }
    return this.configService.getAllConfigs();
  }
}
