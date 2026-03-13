import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ name: 'profit_pool', type: 'decimal', precision: 10, scale: 2 })
  profitPool: number;

  @Column({ type: 'enum', enum: ['pending', 'paid', 'shipped', 'done', 'cancelled'], default: 'pending' })
  status: string;

  @Column({ name: 'pay_type', length: 20, nullable: true })
  payType: string;

  @Column({ name: 'pay_trade_no', length: 100, nullable: true })
  payTradeNo: string;

  @Column({ length: 500, nullable: true })
  remark: string;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
