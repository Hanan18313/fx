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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sys_role_entity_1 = require("../../../database/entities/sys-role.entity");
const sys_role_menu_entity_1 = require("../../../database/entities/sys-role-menu.entity");
let RoleService = class RoleService {
    constructor(roleRepo, roleMenuRepo) {
        this.roleRepo = roleRepo;
        this.roleMenuRepo = roleMenuRepo;
    }
    async list() {
        return this.roleRepo.find({ order: { sort: 'ASC' } });
    }
    async create(dto) {
        const role = this.roleRepo.create({
            name: dto.name,
            code: dto.code,
            description: dto.description,
            dataScope: dto.dataScope,
            sort: dto.sort ?? 0,
            status: dto.status ?? 1,
        });
        const saved = await this.roleRepo.save(role);
        return { id: saved.id };
    }
    async update(id, dto) {
        const role = await this.roleRepo.findOne({ where: { id } });
        if (!role) {
            throw new Error('角色不存在');
        }
        if (dto.name !== undefined)
            role.name = dto.name;
        if (dto.code !== undefined)
            role.code = dto.code;
        if (dto.description !== undefined)
            role.description = dto.description;
        if (dto.dataScope !== undefined)
            role.dataScope = dto.dataScope;
        if (dto.sort !== undefined)
            role.sort = dto.sort;
        if (dto.status !== undefined)
            role.status = dto.status;
        await this.roleRepo.save(role);
        return { id };
    }
    async assignMenus(roleId, menuIds) {
        await this.roleMenuRepo.delete({ roleId });
        if (menuIds.length > 0) {
            const roleMenus = menuIds.map((menuId) => this.roleMenuRepo.create({ roleId, menuId }));
            await this.roleMenuRepo.save(roleMenus);
        }
        return { roleId, menuIds };
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sys_role_entity_1.SysRoleEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(sys_role_menu_entity_1.SysRoleMenuEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RoleService);
//# sourceMappingURL=role.service.js.map