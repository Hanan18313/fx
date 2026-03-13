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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sys_menu_entity_1 = require("../../../database/entities/sys-menu.entity");
const build_tree_1 = require("../utils/build-tree");
let MenuService = class MenuService {
    constructor(menuRepo) {
        this.menuRepo = menuRepo;
    }
    async list() {
        const menus = await this.menuRepo.find({ order: { sort: 'ASC' } });
        return (0, build_tree_1.buildTree)(menus);
    }
    async create(dto) {
        const menu = this.menuRepo.create({
            parentId: dto.parentId ?? 0,
            name: dto.name,
            type: dto.type,
            permission: dto.permission,
            path: dto.path,
            component: dto.component,
            icon: dto.icon,
            sort: dto.sort ?? 0,
            visible: dto.visible ?? 1,
            status: dto.status ?? 1,
        });
        const saved = await this.menuRepo.save(menu);
        return { id: saved.id };
    }
    async update(id, dto) {
        const menu = await this.menuRepo.findOne({ where: { id } });
        if (!menu) {
            throw new Error('菜单不存在');
        }
        if (dto.parentId !== undefined)
            menu.parentId = dto.parentId;
        if (dto.name !== undefined)
            menu.name = dto.name;
        if (dto.type !== undefined)
            menu.type = dto.type;
        if (dto.permission !== undefined)
            menu.permission = dto.permission;
        if (dto.path !== undefined)
            menu.path = dto.path;
        if (dto.component !== undefined)
            menu.component = dto.component;
        if (dto.icon !== undefined)
            menu.icon = dto.icon;
        if (dto.sort !== undefined)
            menu.sort = dto.sort;
        if (dto.visible !== undefined)
            menu.visible = dto.visible;
        if (dto.status !== undefined)
            menu.status = dto.status;
        await this.menuRepo.save(menu);
        return { id };
    }
    async delete(id) {
        const menu = await this.menuRepo.findOne({ where: { id } });
        if (!menu) {
            throw new Error('菜单不存在');
        }
        const children = await this.menuRepo.findOne({ where: { parentId: id } });
        if (children) {
            throw new Error('存在子菜单，无法删除');
        }
        await this.menuRepo.delete(id);
        return { id };
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sys_menu_entity_1.SysMenuEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MenuService);
//# sourceMappingURL=menu.service.js.map