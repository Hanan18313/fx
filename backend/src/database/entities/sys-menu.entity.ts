import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sys_menu')
export class SysMenuEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'parent_id', type: 'bigint', default: 0 })
  parentId: number;

  @Column({ length: 50 })
  name: string;

  @Column()
  type: number;

  @Column({ length: 100, nullable: true })
  permission: string;

  @Column({ length: 200, nullable: true })
  path: string;

  @Column({ length: 200, nullable: true })
  component: string;

  @Column({ length: 50, nullable: true })
  icon: string;

  @Column({ default: 0 })
  sort: number;

  @Column({ default: 1 })
  visible: number;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
