import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { ProfitRecordEntity } from '../database/entities/profit-record.entity';

@Injectable()
export class ProfitService {
  constructor(
    @InjectRepository(ProfitRecordEntity)
    private readonly recordRepo: Repository<ProfitRecordEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async getDashboard(userId: number) {
    const [releasedRow] = await this.dataSource.query(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM profit_records WHERE user_id = ? AND type = 'personal'`,
      [userId],
    );
    const [todayRow] = await this.dataSource.query(
      `SELECT COALESCE(SUM(amount), 0) AS amount FROM profit_records
       WHERE user_id = ? AND type = 'personal' AND released_at = CURDATE()`,
      [userId],
    );
    const [pendingRow] = await this.dataSource.query(
      `SELECT COALESCE(SUM(profit_pool), 0) AS total FROM orders
       WHERE user_id = ? AND status = 'done' AND DATEDIFF(CURDATE(), DATE(paid_at)) < 30`,
      [userId],
    );

    return {
      released_total: releasedRow.total,
      today_amount: todayRow.amount,
      pending_total: pendingRow.total,
    };
  }

  async getRecords(userId: number) {
    const data = await this.recordRepo.find({
      where: { userId },
      order: { releasedAt: 'DESC' },
      take: 100,
    });
    return { data };
  }

  async getTeamProfit(userId: number) {
    const [row] = await this.dataSource.query(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM profit_records WHERE user_id = ? AND type = 'team'`,
      [userId],
    );
    return { team_profit_total: row.total };
  }
}
