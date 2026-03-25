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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionConfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ioredis_1 = __importDefault(require("ioredis"));
const promotion_config_entity_1 = require("../database/entities/promotion-config.entity");
const redis_module_1 = require("../common/redis/redis.module");
const CACHE_PREFIX = 'promo:config:';
const CACHE_TTL = 300;
let PromotionConfigService = class PromotionConfigService {
    constructor(configRepo, redis) {
        this.configRepo = configRepo;
        this.redis = redis;
    }
    async getConfig(key) {
        const cached = await this.redis.get(`${CACHE_PREFIX}${key}`);
        if (cached !== null)
            return cached;
        const row = await this.configRepo.findOne({ where: { configKey: key } });
        if (!row)
            return null;
        await this.redis.set(`${CACHE_PREFIX}${key}`, row.configValue, 'EX', CACHE_TTL);
        return row.configValue;
    }
    async getNumberConfig(key, fallback) {
        const val = await this.getConfig(key);
        if (val === null)
            return fallback;
        const num = Number(val);
        return isNaN(num) ? fallback : num;
    }
    async getBoolConfig(key, fallback) {
        const val = await this.getConfig(key);
        if (val === null)
            return fallback;
        return val === 'true';
    }
    async setConfig(key, value) {
        await this.configRepo.upsert({ configKey: key, configValue: value }, ['configKey']);
        await this.redis.del(`${CACHE_PREFIX}${key}`);
    }
    async getAllConfigs() {
        const rows = await this.configRepo.find();
        const map = {};
        for (const row of rows) {
            map[row.configKey] = row.configValue;
        }
        return map;
    }
};
exports.PromotionConfigService = PromotionConfigService;
exports.PromotionConfigService = PromotionConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(promotion_config_entity_1.PromotionConfigEntity)),
    __param(1, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        ioredis_1.default])
], PromotionConfigService);
//# sourceMappingURL=promotion-config.service.js.map