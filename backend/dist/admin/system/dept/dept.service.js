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
exports.DeptService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sys_dept_entity_1 = require("../../../database/entities/sys-dept.entity");
const build_tree_1 = require("../utils/build-tree");
let DeptService = class DeptService {
    constructor(deptRepo) {
        this.deptRepo = deptRepo;
    }
    async list() {
        const depts = await this.deptRepo.find({ order: { sort: 'ASC' } });
        return (0, build_tree_1.buildTree)(depts);
    }
    async create(dto) {
        const parentId = dto.parentId ?? 0;
        let ancestors = '0';
        if (parentId !== 0) {
            const parent = await this.deptRepo.findOne({ where: { id: parentId } });
            if (!parent) {
                throw new Error('父部门不存在');
            }
            ancestors = parent.ancestors ? `${parent.ancestors},${parent.id}` : `${parent.id}`;
        }
        const dept = this.deptRepo.create({
            parentId,
            ancestors,
            name: dto.name,
            leader: dto.leader,
            phone: dto.phone,
            sort: dto.sort ?? 0,
            status: dto.status ?? 1,
        });
        const saved = await this.deptRepo.save(dept);
        return { id: saved.id };
    }
    async update(id, dto) {
        const dept = await this.deptRepo.findOne({ where: { id } });
        if (!dept) {
            throw new Error('部门不存在');
        }
        if (dto.parentId !== undefined && dto.parentId !== dept.parentId) {
            const newParentId = dto.parentId;
            if (newParentId === 0) {
                dept.ancestors = '0';
            }
            else {
                const parent = await this.deptRepo.findOne({ where: { id: newParentId } });
                if (!parent) {
                    throw new Error('父部门不存在');
                }
                dept.ancestors = parent.ancestors ? `${parent.ancestors},${parent.id}` : `${parent.id}`;
            }
            dept.parentId = newParentId;
        }
        if (dto.name !== undefined)
            dept.name = dto.name;
        if (dto.leader !== undefined)
            dept.leader = dto.leader;
        if (dto.phone !== undefined)
            dept.phone = dto.phone;
        if (dto.sort !== undefined)
            dept.sort = dto.sort;
        if (dto.status !== undefined)
            dept.status = dto.status;
        await this.deptRepo.save(dept);
        return { id };
    }
    async delete(id) {
        const dept = await this.deptRepo.findOne({ where: { id } });
        if (!dept) {
            throw new Error('部门不存在');
        }
        const children = await this.deptRepo.findOne({ where: { parentId: id } });
        if (children) {
            throw new Error('存在子部门，无法删除');
        }
        await this.deptRepo.delete(id);
        return { id };
    }
};
exports.DeptService = DeptService;
exports.DeptService = DeptService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sys_dept_entity_1.SysDeptEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeptService);
//# sourceMappingURL=dept.service.js.map