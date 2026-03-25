import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('promotion_rewards')
@Index('uk_reward_unique', ['userId', 'fromUserId', 'type', 'orderId'], { unique: true })
export class PromotionRewardEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'from_user_id', type: 'bigint' })
  fromUserId: number;

  @Column({ name: 'order_id', type: 'bigint', nullable: true })
  orderId: number;

  @Column({ type: 'enum', enum: ['referral', 'commission'] })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  amount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
