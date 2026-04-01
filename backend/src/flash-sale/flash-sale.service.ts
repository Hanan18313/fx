import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlashSaleEntity } from '../database/entities/flash-sale.entity';

@Injectable()
export class FlashSaleService {
  constructor(
    @InjectRepository(FlashSaleEntity)
    private readonly flashSaleRepo: Repository<FlashSaleEntity>,
  ) {}

  async getActive() {
    const rows = await this.flashSaleRepo
      .createQueryBuilder('fs')
      .innerJoin('products', 'p', 'p.id = fs.product_id AND p.status = :pStatus', { pStatus: 'on' })
      .where('fs.status = 1')
      .andWhere('fs.start_at <= NOW()')
      .andWhere('fs.end_at >= NOW()')
      .orderBy('fs.sort', 'ASC')
      .select([
        'fs.id AS flashSaleId',
        'fs.flash_price AS flashPrice',
        'fs.stock_limit AS stockLimit',
        'fs.end_at AS endAt',
        'p.id AS id',
        'p.name AS name',
        'p.price AS price',
        'p.original_price AS originalPrice',
        'p.images AS images',
        'p.tag AS tag',
        'p.sales AS sales',
        'p.profit_rate AS profitRate',
      ])
      .getRawMany();

    const data = rows.map((r) => ({
      id: r.id,
      name: r.name,
      price: Number(r.price),
      originalPrice: r.originalPrice ? Number(r.originalPrice) : null,
      flashPrice: Number(r.flashPrice),
      images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images,
      tag: r.tag,
      sales: r.sales,
      profitRate: Number(r.profitRate),
      flashSaleId: r.flashSaleId,
      stockLimit: r.stockLimit,
      endAt: r.endAt,
    }));

    return { data };
  }
}
