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
exports.FavoriteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const favorite_entity_1 = require("../database/entities/favorite.entity");
const product_entity_1 = require("../database/entities/product.entity");
let FavoriteService = class FavoriteService {
    constructor(favoriteRepo, productRepo) {
        this.favoriteRepo = favoriteRepo;
        this.productRepo = productRepo;
    }
    async list(userId) {
        const favorites = await this.favoriteRepo.find({
            where: { userId },
            order: { id: 'DESC' },
        });
        if (favorites.length === 0)
            return { data: [] };
        const productIds = favorites.map((f) => f.productId);
        const products = await this.productRepo
            .createQueryBuilder('p')
            .where('p.id IN (:...ids)', { ids: productIds })
            .andWhere('p.status = :status', { status: 'on' })
            .select(['p.id', 'p.name', 'p.price', 'p.images', 'p.profitRate'])
            .getMany();
        const productMap = new Map(products.map((p) => [p.id, p]));
        const data = favorites
            .map((f) => {
            const product = productMap.get(f.productId);
            if (!product)
                return null;
            return { id: f.id, product_id: f.productId, created_at: f.createdAt, product };
        })
            .filter(Boolean);
        return { data };
    }
    async add(userId, productId) {
        const existing = await this.favoriteRepo.findOne({
            where: { userId, productId },
        });
        if (existing)
            return { message: '已收藏' };
        await this.favoriteRepo.save(this.favoriteRepo.create({ userId, productId }));
        return { message: '收藏成功' };
    }
    async remove(userId, productId) {
        await this.favoriteRepo.delete({ userId, productId });
        return { message: '取消收藏' };
    }
};
exports.FavoriteService = FavoriteService;
exports.FavoriteService = FavoriteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(favorite_entity_1.FavoriteEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FavoriteService);
//# sourceMappingURL=favorite.service.js.map