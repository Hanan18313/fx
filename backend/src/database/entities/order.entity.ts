import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'order_no', length: 32, nullable: true })
  orderNo: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ name: 'freight_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  freightAmount: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ name: 'pay_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  payAmount: number;

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

  @Column({ name: 'address_id', type: 'bigint', nullable: true })
  addressId: number;

  @Column({ name: 'address_snapshot', type: 'json', nullable: true })
  addressSnapshot: any;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ name: 'shipped_at', type: 'timestamp', nullable: true })
  shippedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
