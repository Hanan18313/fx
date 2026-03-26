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
exports.BannerMgmtService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const banner_entity_1 = require("../../../database/entities/banner.entity");
let BannerMgmtService = class BannerMgmtService {
    constructor(bannerRepo) {
        this.bannerRepo = bannerRepo;
    }
    async list() {
        return this.bannerRepo.find({ order: { sort: 'ASC', id: 'ASC' } });
    }
    async create(dto) {
        const entity = this.bannerRepo.create(dto);
        return this.bannerRepo.save(entity);
    }
    async update(id, dto) {
        const banner = await this.bannerRepo.findOneBy({ id });
        if (!banner)
            throw new common_1.BadRequestException('Banner不存在');
        await this.bannerRepo.update(id, dto);
        return { message: '更新成功' };
    }
    async remove(id) {
        await this.bannerRepo.delete(id);
        return { message: '删除成功' };
    }
};
exports.BannerMgmtService = BannerMgmtService;
exports.BannerMgmtService = BannerMgmtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(banner_entity_1.BannerEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BannerMgmtService);
//# sourceMappingURL=banner-mgmt.service.js.map