import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sys_dept')
export class SysDeptEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'parent_id', type: 'bigint', default: 0 })
  parentId: number;

  @Column({ length: 500, default: '' })
  ancestors: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50, nullable: true })
  leader: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ default: 0 })
  sort: number;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
