import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { OrderEntity } from '../database/entities/order.entity';
import { ProfitRecordEntity } from '../database/entities/profit-record.entity';
import { WalletEntity } from '../database/entities/wallet.entity';
import { ProfitEngineService } from './profit-engine.service';

@Injectable()
export class ProfitReleaseJob {
  private readonly logger = new Logger(ProfitReleaseJob.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly engine: ProfitEngineService,
  ) {}

  // 每天凌晨 00:05 执行（Asia/Shanghai）
  @Cron('5 0 * * *', { timeZone: 'Asia/Shanghai' })
  async handleProfitRelease() {
    this.logger.log('开始执行分润释放任务...');
    const today = new Date().toISOString().split('T')[0];

    const orders = await this.dataSource.query(`
      SELECT id, user_id, profit_pool,
             DATEDIFF(CURDATE(), DATE(paid_at)) AS days_passed
      FROM orders
      WHERE status = 'done'
        AND DATEDIFF(CURDATE(), DATE(paid_at)) BETWEEN 1 AND 30
    `);

    let processed = 0;
    for (const order of orders) {
      const t = order.days_passed;
      const amount = this.engine.calcPersonalRelease(Number(order.profit_pool), t);

      // 防止重复释放（数据库唯一索引已保障，这里加一层业务检查）
      const [existing] = await this.dataSource.query(
        `SELECT id FROM profit_records WHERE order_id = ? AND day_index = ? AND type = 'personal'`,
        [order.id, t],
      );
      if (existing) continue;

      await this.dataSource.transaction(async (manager) => {
        await manager.query(
          `INSERT INTO profit_records (user_id, order_id, type, day_index, amount, released_at)
           VALUES (?, ?, 'personal', ?, ?, ?)`,
          [order.user_id, order.id, t, amount.toFixed(4), today],
        );
        await manager.query(
          `UPDATE wallets SET balance = balance + ?, total_earn = total_earn + ? WHERE user_id = ?`,
          [amount, amount, order.user_id],
        );
      });
      processed++;
    }

    this.logger.log(`分润释放完成，处理订单数: ${processed}`);
  }
}
