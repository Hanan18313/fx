import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CartItemEntity } from '../database/entities/cart-item.entity';
import { ProductEntity } from '../database/entities/product.entity';
import { UpsertCartDto } from './dto/upsert-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartRepo: Repository<CartItemEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async list(userId: number) {
    const items = await this.cartRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    if (items.length === 0) return { data: [] };

    const productIds = [...new Set(items.map((i) => i.productId))];
    const products = await this.productRepo
      .createQueryBuilder('p')
      .where('p.id IN (:...ids)', { ids: productIds })
      .select(['p.id', 'p.name', 'p.price', 'p.originalPrice', 'p.images', 'p.tag', 'p.stock', 'p.status'])
      .getMany();

    const productMap = new Map(products.map((p) => [p.id, p]));
    const data = items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      spec: item.spec,
      selected: item.selected,
      product: productMap.get(item.productId) ?? null,
    }));

    return { data };
  }

  async add(userId: number, dto: UpsertCartDto) {
    const product = await this.productRepo.findOne({ where: { id: dto.productId, status: 'on' } });
    if (!product) throw new NotFoundException('商品不存在或已下架');

    const existing = await this.cartRepo.findOne({
      where: { userId, productId: dto.productId, spec: dto.spec ?? null },
    });

    if (existing) {
      existing.quantity += dto.quantity;
      await this.cartRepo.save(existing);
      return { id: existing.id };
    }

    const item = await this.cartRepo.save(
      this.cartRepo.create({
        userId,
        productId: dto.productId,
        quantity: dto.quantity,
        spec: dto.spec ?? null,
        selected: 1,
      }),
    );
    return { id: item.id };
  }

  async updateQuantity(userId: number, itemId: number, quantity: number) {
    const item = await this.cartRepo.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException('购物车项不存在');
    if (item.userId !== userId) throw new ForbiddenException();

    item.quantity = quantity;
    await this.cartRepo.save(item);
    return {};
  }

  async remove(userId: number, itemId: number) {
    const item = await this.cartRepo.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException('购物车项不存在');
    if (item.userId !== userId) throw new ForbiddenException();

    await this.cartRepo.delete(itemId);
    return {};
  }

  async clear(userId: number) {
    await this.cartRepo.delete({ userId });
    return {};
  }
}
