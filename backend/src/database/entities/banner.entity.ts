import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('banners')
export class BannerEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'image_url', length: 500 })
  imageUrl: string;

  @Column({ length: 100, nullable: true })
  title: string;

  @Column({ name: 'link_type', length: 20, nullable: true })
  linkType: string;

  @Column({ name: 'link_value', length: 200, nullable: true })
  linkValue: string;

  @Column({ default: 0 })
  sort: number;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
