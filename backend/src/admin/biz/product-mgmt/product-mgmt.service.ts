import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../../database/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductMgmtService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async list(params: {
    page: number;
    pageSize: number;
    name?: string;
    category?: string;
    status?: string;
  }) {
    const { page, pageSize, name, category, status } = params;
    const qb = this.productRepo.createQueryBuilder('p');

    if (name) {
      qb.andWhere('p.name LIKE :name', { name: `%${name}%` });
    }
    if (category) {
      qb.andWhere('p.category = :category', { category });
    }
    if (status) {
      qb.andWhere('p.status = :status', { status });
    }

    qb.orderBy('p.createdAt', 'DESC');

    const total = await qb.getCount();
    const list = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return { list, total, page, pageSize };
  }

  async create(dto: CreateProductDto) {
    this.validateProductData(dto);
    const product = this.productRepo.create(dto);
    await this.productRepo.save(product);
    return { message: '创建成功', id: product.id };
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new BadRequestException('商品不存在');
    }

    if (dto.price !== undefined || dto.profitRate !== undefined || dto.stock !== undefined) {
      this.validateProductData({
        price: dto.price ?? product.price,
        profitRate: dto.profitRate ?? product.profitRate,
        stock: dto.stock ?? product.stock,
      });
    }

    await this.productRepo.update(id, dto);
    return { message: '更新成功' };
  }

  async toggleStatus(id: number) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new BadRequestException('商品不存在');
    }

    const newStatus = product.status === 'on' ? 'off' : 'on';
    await this.productRepo.update(id, { status: newStatus });
    return { message: '状态更新成功', status: newStatus };
  }

  private validateProductData(data: { price?: number; profitRate?: number; stock?: number }) {
    if (data.price !== undefined && data.price <= 0) {
      throw new BadRequestException('价格必须大于0');
    }
    if (data.profitRate !== undefined && (data.profitRate < 0 || data.profitRate > 1)) {
      throw new BadRequestException('利润率必须在0到1之间');
    }
    if (data.stock !== undefined && data.stock < 0) {
      throw new BadRequestException('库存不能小于0');
    }
  }
}
