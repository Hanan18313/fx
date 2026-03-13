import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ProfitMgmtService {
  constructor(private readonly dataSource: DataSource) {}

  async getStats() {
    // Total profit released
    const [totalResult] = await this.dataSource.query(
      `SELECT COALESCE(SUM(amount), 0) AS totalProfit FROM profit_records`,
    );

    // Today's profit released
    const [todayResult] = await this.dataSource.query(
      `SELECT COALESCE(SUM(amount), 0) AS todayProfit
       FROM profit_records
       WHERE DATE(released_at) = CURDATE()`,
    );

    // Total personal vs team profit
    const typeResults = await this.dataSource.query(
      `SELECT type, COALESCE(SUM(amount), 0) AS totalAmount
       FROM profit_records
       GROUP BY type`,
    );

    const profitByType: Record<string, number> = { personal: 0, team: 0 };
    for (const row of typeResults) {
      profitByType[row.type] = parseFloat(row.totalAmount);
    }

    // Top 10 earners
    const topEarners = await this.dataSource.query(
      `SELECT pr.user_id AS userId,
              u.phone,
              u.nickname,
              COALESCE(SUM(pr.amount), 0) AS totalEarned
       FROM profit_records pr
       LEFT JOIN users u ON u.id = pr.user_id
       GROUP BY pr.user_id, u.phone, u.nickname
       ORDER BY totalEarned DESC
       LIMIT 10`,
    );

    return {
      totalProfit: parseFloat(totalResult.totalProfit),
      todayProfit: parseFloat(todayResult.todayProfit),
      personalProfit: profitByType.personal,
      teamProfit: profitByType.team,
      topEarners: topEarners.map((row) => ({
        userId: row.userId,
        phone: row.phone,
        nickname: row.nickname,
        totalEarned: parseFloat(row.totalEarned),
      })),
    };
  }
}
