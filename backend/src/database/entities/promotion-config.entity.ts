import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('promotion_configs')
export class PromotionConfigEntity {
  @PrimaryColumn({ name: 'config_key', length: 50 })
  configKey: string;

  @Column({ name: 'config_value', length: 200 })
  configValue: string;

  @Column({ length: 200, nullable: true })
  description: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
