import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sys_login_log')
export class SysLoginLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'admin_id', type: 'bigint', nullable: true })
  adminId: number;

  @Column({ length: 50 })
  username: string;

  @Column({ length: 50, nullable: true })
  ip: string;

  @Column({ name: 'user_agent', length: 500, nullable: true })
  userAgent: string;

  @Column()
  status: number;

  @Column({ length: 200, nullable: true })
  message: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
