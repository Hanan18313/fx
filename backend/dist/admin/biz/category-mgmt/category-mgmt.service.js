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
exports.CategoryMgmtService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../../../database/entities/category.entity");
let CategoryMgmtService = class CategoryMgmtService {
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async list() {
        const all = await this.categoryRepo.find({
            order: { sort: 'ASC', id: 'ASC' },
        });
        const map = new Map();
        const roots = [];
        for (const cat of all) {
            map.set(cat.id, { ...cat, children: [] });
        }
        for (const cat of all) {
            const node = map.get(cat.id);
            if (cat.parentId && map.has(cat.parentId)) {
                map.get(cat.parentId).children.push(node);
            }
            else if (!cat.parentId) {
                roots.push(node);
            }
        }
        return roots;
    }
    async create(dto) {
        const entity = this.categoryRepo.create(dto);
        return this.categoryRepo.save(entity);
    }
    async update(id, dto) {
        const cat = await this.categoryRepo.findOneBy({ id });
        if (!cat)
            throw new common_1.BadRequestException('分类不存在');
        await this.categoryRepo.update(id, dto);
        return { message: '更新成功' };
    }
    async remove(id) {
        const children = await this.categoryRepo.findOneBy({ parentId: id });
        if (children) {
            throw new common_1.BadRequestException('该分类下存在子分类，无法删除');
        }
        await this.categoryRepo.delete(id);
        return { message: '删除成功' };
    }
};
exports.CategoryMgmtService = CategoryMgmtService;
exports.CategoryMgmtService = CategoryMgmtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoryMgmtService);
//# sourceMappingURL=category-mgmt.service.js.map