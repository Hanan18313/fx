import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  async getStats() {
    // Total users count
    const [usersTotal] = await this.dataSource.query(
      `SELECT COUNT(*) AS count FROM users`,
    );

    // Today new users
    const [usersToday] = await this.dataSource.query(
      `SELECT COUNT(*) AS count FROM users WHERE DATE(created_at) = CURDATE()`,
    );

    // Total orders count
    const [ordersTotal] = await this.dataSource.query(
      `SELECT COUNT(*) AS count FROM orders`,
    );

    // Today orders
    const [ordersToday] = await this.dataSource.query(
      `SELECT COUNT(*) AS count FROM orders WHERE DATE(created_at) = CURDATE()`,
    );

    // Total revenue (SUM totalAmount from paid orders)
    const [revenue] = await this.dataSource.query(
      `SELECT COALESCE(SUM(total_amount), 0) AS totalRevenue
       FROM orders
       WHERE status IN ('paid', 'shipped', 'done')`,
    );

    // Pending withdrawals count
    const [pendingWithdrawals] = await this.dataSource.query(
      `SELECT COUNT(*) AS count FROM withdrawals WHERE status = 'pending'`,
    );

    return {
      totalUsers: parseInt(usersTotal.count, 10),
      todayNewUsers: parseInt(usersToday.count, 10),
      totalOrders: parseInt(ordersTotal.count, 10),
      todayOrders: parseInt(ordersToday.count, 10),
      totalRevenue: parseFloat(revenue.totalRevenue),
      pendingWithdrawals: parseInt(pendingWithdrawals.count, 10),
    };
  }
}
