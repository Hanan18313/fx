import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'original_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column({ name: 'profit_rate', type: 'decimal', precision: 5, scale: 4, default: 0.25 })
  profitRate: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  sales: number;

  @Column({ type: 'enum', enum: ['promotion', 'new', 'hot', 'member_exclusive'], nullable: true })
  tag: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ length: 50, nullable: true })
  category: string;

  @Column({ name: 'category_id', type: 'bigint', nullable: true })
  categoryId: number;

  @Column({ type: 'enum', enum: ['on', 'off'], default: 'on' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
