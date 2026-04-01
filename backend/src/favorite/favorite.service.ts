import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteEntity } from '../database/entities/favorite.entity';
import { ProductEntity } from '../database/entities/product.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favoriteRepo: Repository<FavoriteEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async list(userId: number) {
    const favorites = await this.favoriteRepo.find({
      where: { userId },
      order: { id: 'DESC' },
    });

    if (favorites.length === 0) return { data: [] };

    const productIds = favorites.map((f) => f.productId);
    const products = await this.productRepo
      .createQueryBuilder('p')
      .where('p.id IN (:...ids)', { ids: productIds })
      .andWhere('p.status = :status', { status: 'on' })
      .select(['p.id', 'p.name', 'p.price', 'p.originalPrice', 'p.images', 'p.tag'])
      .getMany();

    const productMap = new Map(products.map((p) => [p.id, p]));
    const data = favorites
      .map((f) => {
        const product = productMap.get(f.productId);
        if (!product) return null;
        return {
          productId: f.productId,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          images: product.images,
          tag: product.tag,
        };
      })
      .filter(Boolean);

    return { data };
  }

  async add(userId: number, productId: number) {
    const existing = await this.favoriteRepo.findOne({
      where: { userId, productId },
    });
    if (existing) return { message: '已收藏' };

    await this.favoriteRepo.save(
      this.favoriteRepo.create({ userId, productId }),
    );
    return { message: '收藏成功' };
  }

  async remove(userId: number, productId: number) {
    await this.favoriteRepo.delete({ userId, productId });
    return { message: '取消收藏' };
  }
}
