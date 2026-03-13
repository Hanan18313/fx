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
exports.LogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sys_operation_log_entity_1 = require("../../../database/entities/sys-operation-log.entity");
const sys_login_log_entity_1 = require("../../../database/entities/sys-login-log.entity");
let LogService = class LogService {
    constructor(operationLogRepo, loginLogRepo) {
        this.operationLogRepo = operationLogRepo;
        this.loginLogRepo = loginLogRepo;
    }
    async listOperationLogs(query) {
        const page = query.page || 1;
        const pageSize = query.pageSize || 10;
        const qb = this.operationLogRepo.createQueryBuilder('log');
        if (query.module) {
            qb.andWhere('log.module LIKE :module', { module: `%${query.module}%` });
        }
        if (query.action) {
            qb.andWhere('log.action LIKE :action', { action: `%${query.action}%` });
        }
        if (query.adminName) {
            qb.andWhere('log.admin_name LIKE :adminName', { adminName: `%${query.adminName}%` });
        }
        if (query.startDate) {
            qb.andWhere('log.created_at >= :startDate', { startDate: query.startDate });
        }
        if (query.endDate) {
            qb.andWhere('log.created_at <= :endDate', { endDate: query.endDate });
        }
        const total = await qb.getCount();
        const list = await qb
            .orderBy('log.created_at', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getMany();
        return { list, total, page, pageSize };
    }
    async listLoginLogs(query) {
        const page = query.page || 1;
        const pageSize = query.pageSize || 10;
        const qb = this.loginLogRepo.createQueryBuilder('log');
        if (query.username) {
            qb.andWhere('log.username LIKE :username', { username: `%${query.username}%` });
        }
        if (query.status !== undefined && query.status !== null) {
            qb.andWhere('log.status = :status', { status: query.status });
        }
        if (query.startDate) {
            qb.andWhere('log.created_at >= :startDate', { startDate: query.startDate });
        }
        if (query.endDate) {
            qb.andWhere('log.created_at <= :endDate', { endDate: query.endDate });
        }
        const total = await qb.getCount();
        const list = await qb
            .orderBy('log.created_at', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getMany();
        return { list, total, page, pageSize };
    }
};
exports.LogService = LogService;
exports.LogService = LogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sys_operation_log_entity_1.SysOperationLogEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(sys_login_log_entity_1.SysLoginLogEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LogService);
//# sourceMappingURL=log.service.js.map