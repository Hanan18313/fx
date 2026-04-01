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
exports.FlashSaleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const flash_sale_entity_1 = require("../database/entities/flash-sale.entity");
let FlashSaleService = class FlashSaleService {
    constructor(flashSaleRepo) {
        this.flashSaleRepo = flashSaleRepo;
    }
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
};
exports.FlashSaleService = FlashSaleService;
exports.FlashSaleService = FlashSaleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(flash_sale_entity_1.FlashSaleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FlashSaleService);
//# sourceMappingURL=flash-sale.service.js.map