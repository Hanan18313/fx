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
exports.ProductMgmtService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../../../database/entities/product.entity");
let ProductMgmtService = class ProductMgmtService {
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    async list(params) {
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
    async create(dto) {
        this.validateProductData(dto);
        const product = this.productRepo.create(dto);
        await this.productRepo.save(product);
        return { message: '创建成功', id: product.id };
    }
    async update(id, dto) {
        const product = await this.productRepo.findOneBy({ id });
        if (!product) {
            throw new common_1.BadRequestException('商品不存在');
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
    async toggleStatus(id) {
        const product = await this.productRepo.findOneBy({ id });
        if (!product) {
            throw new common_1.BadRequestException('商品不存在');
        }
        const newStatus = product.status === 'on' ? 'off' : 'on';
        await this.productRepo.update(id, { status: newStatus });
        return { message: '状态更新成功', status: newStatus };
    }
    validateProductData(data) {
        if (data.price !== undefined && data.price <= 0) {
            throw new common_1.BadRequestException('价格必须大于0');
        }
        if (data.profitRate !== undefined && (data.profitRate < 0 || data.profitRate > 1)) {
            throw new common_1.BadRequestException('利润率必须在0到1之间');
        }
        if (data.stock !== undefined && data.stock < 0) {
            throw new common_1.BadRequestException('库存不能小于0');
        }
    }
};
exports.ProductMgmtService = ProductMgmtService;
exports.ProductMgmtService = ProductMgmtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductMgmtService);
//# sourceMappingURL=product-mgmt.service.js.map