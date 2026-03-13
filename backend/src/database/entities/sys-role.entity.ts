import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sys_role')
export class SysRoleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 200, nullable: true })
  description: string;

  @Column({ name: 'data_scope', default: 4 })
  dataScope: number;

  @Column({ default: 0 })
  sort: number;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
