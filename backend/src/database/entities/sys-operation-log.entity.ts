import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sys_operation_log')
export class SysOperationLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'admin_id', type: 'bigint', nullable: true })
  adminId: number;

  @Column({ name: 'admin_name', length: 50, nullable: true })
  adminName: string;

  @Column({ length: 50 })
  module: string;

  @Column({ length: 50 })
  action: string;

  @Column({ length: 10 })
  method: string;

  @Column({ length: 500 })
  url: string;

  @Column({ name: 'request_body', type: 'json', nullable: true })
  requestBody: any;

  @Column({ name: 'response_code', nullable: true })
  responseCode: number;

  @Column({ length: 50, nullable: true })
  ip: string;

  @Column({ name: 'user_agent', length: 500, nullable: true })
  userAgent: string;

  @Column({ name: 'duration_ms', nullable: true })
  durationMs: number;

  @Column({ default: 1 })
  status: number;

  @Column({ name: 'error_msg', type: 'text', nullable: true })
  errorMsg: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
