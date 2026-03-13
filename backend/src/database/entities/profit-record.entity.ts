import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity('profit_records')
@Unique(['orderId', 'dayIndex', 'type'])
export class ProfitRecordEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'order_id', type: 'bigint' })
  orderId: number;

  @Column({ type: 'enum', enum: ['personal', 'team'] })
  type: string;

  @Column({ name: 'day_index', type: 'tinyint' })
  dayIndex: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  amount: number;

  @Column({ name: 'released_at', type: 'date' })
  releasedAt: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
