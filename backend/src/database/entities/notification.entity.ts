import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ type: 'enum', enum: ['system', 'order', 'profit'], default: 'system' })
  type: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'is_read', default: 0 })
  isRead: number;

  @Column({ name: 'link_type', length: 20, nullable: true })
  linkType: string;

  @Column({ name: 'link_value', length: 100, nullable: true })
  linkValue: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
