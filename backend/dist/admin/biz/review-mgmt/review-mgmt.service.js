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
exports.ReviewMgmtService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("../../../database/entities/review.entity");
let ReviewMgmtService = class ReviewMgmtService {
    constructor(reviewRepo) {
        this.reviewRepo = reviewRepo;
    }
    async list(params) {
        const { page, pageSize, productId, rating } = params;
        const qb = this.reviewRepo
            .createQueryBuilder('r')
            .leftJoin('users', 'u', 'u.id = r.user_id')
            .leftJoin('products', 'p', 'p.id = r.product_id')
            .addSelect([
            'u.nickname AS userNickname',
            "CONCAT(LEFT(u.phone, 3), '****', RIGHT(u.phone, 4)) AS userPhone",
            'p.name AS productName',
        ]);
        if (productId) {
            qb.andWhere('r.product_id = :productId', { productId });
        }
        if (rating) {
            qb.andWhere('r.rating = :rating', { rating });
        }
        qb.orderBy('r.created_at', 'DESC');
        const total = await qb.getCount();
        const raw = await qb
            .offset((page - 1) * pageSize)
            .limit(pageSize)
            .getRawAndEntities();
        const list = raw.entities.map((review, idx) => ({
            ...review,
            userNickname: raw.raw[idx]?.userNickname ?? null,
            userPhone: raw.raw[idx]?.userPhone ?? null,
            productName: raw.raw[idx]?.productName ?? null,
        }));
        return { list, total, page, pageSize };
    }
    async remove(id) {
        await this.reviewRepo.delete(id);
        return { message: '删除成功' };
    }
};
exports.ReviewMgmtService = ReviewMgmtService;
exports.ReviewMgmtService = ReviewMgmtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.ReviewEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReviewMgmtService);
//# sourceMappingURL=review-mgmt.service.js.map