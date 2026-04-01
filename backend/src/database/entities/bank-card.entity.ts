import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('bank_cards')
export class BankCardEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'bank_name', length: 50 })
  bankName: string;

  @Column({ name: 'card_no', length: 30 })
  cardNo: string;

  @Column({ name: 'last_four', length: 4 })
  lastFour: string;

  @Column({ name: 'real_name', length: 50 })
  realName: string;

  @Column({ name: 'is_default', default: 0 })
  isDefault: number;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
