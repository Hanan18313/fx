import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('wallets')
export class WalletEntity {
  @PrimaryColumn({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  frozen: number;

  @Column({ name: 'total_earn', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalEarn: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
