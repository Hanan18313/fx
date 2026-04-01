import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('withdrawals')
export class WithdrawalEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['bank', 'alipay'], default: 'bank' })
  method: string;

  @Column({ name: 'bank_card_id', type: 'bigint', nullable: true })
  bankCardId: number;

  @Column({ name: 'bank_name', length: 50, nullable: true })
  bankName: string;

  @Column({ name: 'bank_account', length: 50, nullable: true })
  bankAccount: string;

  @Column({ name: 'real_name', length: 50, nullable: true })
  realName: string;

  @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: string;

  @Column({ name: 'reject_reason', length: 200, nullable: true })
  rejectReason: string;

  @CreateDateColumn({ name: 'applied_at' })
  appliedAt: Date;

  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processedAt: Date;
}
