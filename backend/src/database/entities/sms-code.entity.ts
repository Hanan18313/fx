import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sms_codes')
export class SmsCodeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 10 })
  code: string;

  @Column({ length: 20, default: 'register' })
  scene: string;

  @Column({ default: 0 })
  used: number;

  @Column({ name: 'expired_at', type: 'timestamp' })
  expiredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
