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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const typeorm_1 = require("typeorm");
const operation_log_decorator_1 = require("../decorators/operation-log.decorator");
const sys_operation_log_entity_1 = require("../../database/entities/sys-operation-log.entity");
let OperationLogInterceptor = class OperationLogInterceptor {
    constructor(reflector, dataSource) {
        this.reflector = reflector;
        this.dataSource = dataSource;
    }
    intercept(context, next) {
        const logMeta = this.reflector.get(operation_log_decorator_1.OPERATION_LOG_KEY, context.getHandler());
        if (!logMeta)
            return next.handle();
        const request = context.switchToHttp().getRequest();
        const startTime = Date.now();
        return next.handle().pipe((0, rxjs_1.tap)({
            next: () => {
                this.saveLog(request, logMeta, startTime, 1, null);
            },
            error: (err) => {
                this.saveLog(request, logMeta, startTime, 0, err.message);
            },
        }));
    }
    saveLog(request, logMeta, startTime, status, errorMsg) {
        const admin = request.user;
        const log = new sys_operation_log_entity_1.SysOperationLogEntity();
        log.adminId = admin?.id;
        log.adminName = admin?.username;
        log.module = logMeta.module;
        log.action = logMeta.action;
        log.method = request.method;
        log.url = request.originalUrl || request.url;
        log.requestBody = ['POST', 'PUT', 'PATCH'].includes(request.method)
            ? request.body
            : null;
        log.ip = request.ip;
        log.userAgent = request.headers?.['user-agent'];
        log.durationMs = Date.now() - startTime;
        log.status = status;
        log.errorMsg = errorMsg;
        this.dataSource
            .getRepository(sys_operation_log_entity_1.SysOperationLogEntity)
            .save(log)
            .catch(() => { });
    }
};
exports.OperationLogInterceptor = OperationLogInterceptor;
exports.OperationLogInterceptor = OperationLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        typeorm_1.DataSource])
], OperationLogInterceptor);
//# sourceMappingURL=operation-log.interceptor.js.map