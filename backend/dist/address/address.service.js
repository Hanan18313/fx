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
exports.AddressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const address_entity_1 = require("../database/entities/address.entity");
let AddressService = class AddressService {
    constructor(addressRepo) {
        this.addressRepo = addressRepo;
    }
    async list(userId) {
        const data = await this.addressRepo.find({
            where: { userId },
            order: { isDefault: 'DESC', id: 'DESC' },
        });
        return { data };
    }
    async create(userId, dto) {
        if (dto.is_default === 1) {
            await this.addressRepo.update({ userId }, { isDefault: 0 });
        }
        const address = this.addressRepo.create({
            userId,
            name: dto.name,
            phone: dto.phone,
            province: dto.province,
            city: dto.city,
            district: dto.district,
            detail: dto.detail,
            isDefault: dto.is_default ?? 0,
        });
        const saved = await this.addressRepo.save(address);
        return saved;
    }
    async update(id, userId, dto) {
        const address = await this.addressRepo.findOne({ where: { id } });
        if (!address)
            throw new common_1.NotFoundException('地址不存在');
        if (address.userId !== userId)
            throw new common_1.ForbiddenException('无权操作');
        if (dto.is_default === 1) {
            await this.addressRepo.update({ userId }, { isDefault: 0 });
        }
        const updateData = {};
        if (dto.name !== undefined)
            updateData.name = dto.name;
        if (dto.phone !== undefined)
            updateData.phone = dto.phone;
        if (dto.province !== undefined)
            updateData.province = dto.province;
        if (dto.city !== undefined)
            updateData.city = dto.city;
        if (dto.district !== undefined)
            updateData.district = dto.district;
        if (dto.detail !== undefined)
            updateData.detail = dto.detail;
        if (dto.is_default !== undefined)
            updateData.isDefault = dto.is_default;
        await this.addressRepo.update(id, updateData);
        return { message: '更新成功' };
    }
    async remove(id, userId) {
        const address = await this.addressRepo.findOne({ where: { id } });
        if (!address)
            throw new common_1.NotFoundException('地址不存在');
        if (address.userId !== userId)
            throw new common_1.ForbiddenException('无权操作');
        await this.addressRepo.delete(id);
        return { message: '删除成功' };
    }
};
exports.AddressService = AddressService;
exports.AddressService = AddressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(address_entity_1.AddressEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AddressService);
//# sourceMappingURL=address.service.js.map