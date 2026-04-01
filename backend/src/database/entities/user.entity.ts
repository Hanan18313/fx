import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 20, unique: true })
  phone: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 50, nullable: true })
  nickname: string;

  @Column({ length: 500, nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: ['user', 'distributor', 'agent', 'admin'], default: 'user' })
  role: string;

  @Column({ name: 'invite_code', length: 10, unique: true })
  inviteCode: string;

  @Column({ name: 'member_no', length: 20, nullable: true })
  memberNo: string;

  @Column({ name: 'member_expire', type: 'date', nullable: true })
  memberExpire: string;

  @Column({ name: 'parent_id', type: 'bigint', nullable: true })
  parentId: number;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
