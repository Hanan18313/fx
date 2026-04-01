"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_item_entity_1 = require("../database/entities/cart-item.entity");
const product_entity_1 = require("../database/entities/product.entity");
let CartService = class CartService {
    constructor(cartRepo, productRepo, dataSource) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
        this.dataSource = dataSource;
    }
    async list(userId) {
        const items = await this.cartRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        if (items.length === 0)
            return { data: [] };
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
    async add(userId, dto) {
        const product = await this.productRepo.findOne({ where: { id: dto.productId, status: 'on' } });
        if (!product)
            throw new common_1.NotFoundException('商品不存在或已下架');
        const existing = await this.cartRepo.findOne({
            where: { userId, productId: dto.productId, spec: dto.spec ?? null },
        });
        if (existing) {
            existing.quantity += dto.quantity;
            await this.cartRepo.save(existing);
            return { id: existing.id };
        }
        const item = await this.cartRepo.save(this.cartRepo.create({
            userId,
            productId: dto.productId,
            quantity: dto.quantity,
            spec: dto.spec ?? null,
            selected: 1,
        }));
        return { id: item.id };
    }
    async updateQuantity(userId, itemId, quantity) {
        const item = await this.cartRepo.findOne({ where: { id: itemId } });
        if (!item)
            throw new common_1.NotFoundException('购物车项不存在');
        if (item.userId !== userId)
            throw new common_1.ForbiddenException();
        item.quantity = quantity;
        await this.cartRepo.save(item);
        return {};
    }
    async remove(userId, itemId) {
        const item = await this.cartRepo.findOne({ where: { id: itemId } });
        if (!item)
            throw new common_1.NotFoundException('购物车项不存在');
        if (item.userId !== userId)
            throw new common_1.ForbiddenException();
        await this.cartRepo.delete(itemId);
        return {};
    }
    async clear(userId) {
        await this.cartRepo.delete({ userId });
        return {};
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItemEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], CartService);
//# sourceMappingURL=cart.service.js.map