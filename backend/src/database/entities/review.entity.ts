import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'product_id', type: 'bigint' })
  productId: number;

  @Column({ name: 'order_id', type: 'bigint' })
  orderId: number;

  @Column({ default: 5 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ name: 'is_anonymous', default: 0 })
  isAnonymous: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
