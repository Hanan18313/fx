import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { ProductEntity } from "../database/entities/product.entity";

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async getProducts(page = 1, limit = 20, keyword = "") {
    const [data, total] = await this.productRepo.findAndCount({
      where: {
        status: "on",
        ...(keyword ? { name: Like(`%${keyword}%`) } : {}),
      },
      order: { id: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
      select: [
        "id",
        "name",
        "price",
        "profitRate",
        "stock",
        "images",
        "category",
      ],
    });
    return { data, total, page };
  }

  async getProduct(id: number) {
    const product = await this.productRepo.findOne({
      where: { id, status: "on" },
    });
    if (!product) throw new NotFoundException("商品不存在");
    return product;
  }
}
