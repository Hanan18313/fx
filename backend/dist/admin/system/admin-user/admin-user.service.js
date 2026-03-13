"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const sys_admin_entity_1 = require("../../../database/entities/sys-admin.entity");
const sys_admin_role_entity_1 = require("../../../database/entities/sys-admin-role.entity");
let AdminUserService = class AdminUserService {
    constructor(adminRepo, adminRoleRepo, dataSource) {
        this.adminRepo = adminRepo;
        this.adminRoleRepo = adminRoleRepo;
        this.dataSource = dataSource;
    }
    async list(query) {
        const page = query.page || 1;
        const pageSize = query.pageSize || 10;
        let whereSql = "a.deleted_at IS NULL";
        const params = [];
        if (query.username) {
            whereSql += " AND a.username LIKE ?";
            params.push(`%${query.username}%`);
        }
        if (query.realName) {
            whereSql += " AND a.real_name LIKE ?";
            params.push(`%${query.realName}%`);
        }
        if (query.phone) {
            whereSql += " AND a.phone LIKE ?";
            params.push(`%${query.phone}%`);
        }
        if (query.status !== undefined && query.status !== null) {
            whereSql += " AND a.status = ?";
            params.push(query.status);
        }
        if (query.deptId) {
            whereSql += " AND a.dept_id = ?";
            params.push(query.deptId);
        }
        console.log("WHERE SQL:", whereSql, query);
        const [countRow] = await this.dataSource.query(`SELECT COUNT(*) AS total FROM sys_admin a WHERE ${whereSql}`, params);
        const total = Number(countRow.total);
        const list = await this.dataSource.query(`SELECT a.id, a.username, a.real_name AS realName, a.email, a.phone,
              a.avatar, a.dept_id AS deptId, d.name AS deptName,
              a.status, a.last_login_at AS lastLoginAt, a.created_at AS createdAt
       FROM sys_admin a
       LEFT JOIN sys_dept d ON d.id = a.dept_id
       WHERE ${whereSql}
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`, [...params, pageSize, (page - 1) * pageSize]);
        if (list.length > 0) {
            const adminIds = list
                .map((item) => Number(item.id))
                .filter((id) => !isNaN(id));
            if (adminIds.length > 0) {
                const placeholders = adminIds.map(() => "?").join(",");
                const roles = await this.dataSource.query(`SELECT ar.admin_id AS adminId, r.id, r.name, r.code
           FROM sys_admin_role ar
           JOIN sys_role r ON r.id = ar.role_id
           WHERE ar.admin_id IN (${placeholders})`, adminIds);
                const roleMap = new Map();
                for (const role of roles) {
                    const arr = roleMap.get(Number(role.adminId)) || [];
                    arr.push({ id: Number(role.id), name: role.name, code: role.code });
                    roleMap.set(Number(role.adminId), arr);
                }
                for (const item of list) {
                    item.id = Number(item.id);
                    item.deptId = item.deptId != null ? Number(item.deptId) : null;
                    item.roles = roleMap.get(item.id) || [];
                }
            }
        }
        return { list, total, page, pageSize };
    }
    async create(dto, createdBy) {
        const exists = await this.adminRepo.findOne({
            where: { username: dto.username },
        });
        if (exists) {
            throw new Error("用户名已存在");
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const admin = this.adminRepo.create({
            username: dto.username,
            password: hashedPassword,
            realName: dto.realName,
            email: dto.email,
            phone: dto.phone,
            deptId: dto.deptId,
            status: dto.status ?? 1,
            createdBy,
        });
        const saved = await this.adminRepo.save(admin);
        if (dto.roleIds && dto.roleIds.length > 0) {
            const adminRoles = dto.roleIds.map((roleId) => this.adminRoleRepo.create({ adminId: saved.id, roleId }));
            await this.adminRoleRepo.save(adminRoles);
        }
        return { id: saved.id };
    }
    async update(id, dto) {
        const admin = await this.adminRepo.findOne({ where: { id } });
        if (!admin || admin.deletedAt) {
            throw new Error("管理员不存在");
        }
        if (dto.realName !== undefined)
            admin.realName = dto.realName;
        if (dto.email !== undefined)
            admin.email = dto.email;
        if (dto.phone !== undefined)
            admin.phone = dto.phone;
        if (dto.deptId !== undefined)
            admin.deptId = dto.deptId;
        if (dto.status !== undefined)
            admin.status = dto.status;
        await this.adminRepo.save(admin);
        if (dto.roleIds !== undefined) {
            await this.adminRoleRepo.delete({ adminId: id });
            if (dto.roleIds.length > 0) {
                const adminRoles = dto.roleIds.map((roleId) => this.adminRoleRepo.create({ adminId: id, roleId }));
                await this.adminRoleRepo.save(adminRoles);
            }
        }
        return { id };
    }
    async resetPassword(id, newPassword) {
        const admin = await this.adminRepo.findOne({ where: { id } });
        if (!admin || admin.deletedAt) {
            throw new Error("管理员不存在");
        }
        admin.password = await bcrypt.hash(newPassword, 10);
        await this.adminRepo.save(admin);
        return { id };
    }
};
exports.AdminUserService = AdminUserService;
exports.AdminUserService = AdminUserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sys_admin_entity_1.SysAdminEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(sys_admin_role_entity_1.SysAdminRoleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], AdminUserService);
//# sourceMappingURL=admin-user.service.js.map