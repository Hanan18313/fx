"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfitModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const profit_record_entity_1 = require("../database/entities/profit-record.entity");
const profit_controller_1 = require("./profit.controller");
const profit_service_1 = require("./profit.service");
const profit_engine_service_1 = require("./profit-engine.service");
const profit_release_job_1 = require("./profit-release.job");
let ProfitModule = class ProfitModule {
};
exports.ProfitModule = ProfitModule;
exports.ProfitModule = ProfitModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([profit_record_entity_1.ProfitRecordEntity])],
        controllers: [profit_controller_1.ProfitController],
        providers: [profit_service_1.ProfitService, profit_engine_service_1.ProfitEngineService, profit_release_job_1.ProfitReleaseJob],
        exports: [profit_engine_service_1.ProfitEngineService],
    })
], ProfitModule);
//# sourceMappingURL=profit.module.js.map