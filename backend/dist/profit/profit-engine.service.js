"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfitEngineService = void 0;
const common_1 = require("@nestjs/common");
const a = 0.55;
const b = 1.06;
const PERSONAL_DAYS = 30;
const TEAM_DAYS = 36;
const S1 = Array.from({ length: PERSONAL_DAYS }, (_, i) => Math.pow(a, i + 1))
    .reduce((sum, v) => sum + v, 0);
let ProfitEngineService = class ProfitEngineService {
    calcPersonalRelease(profitPool, t) {
        if (t < 1 || t > PERSONAL_DAYS)
            return 0;
        return profitPool * (Math.pow(a, t) / S1);
    }
    calcTeamWeight(d) {
        if (d < 1 || d > TEAM_DAYS)
            return 0;
        return Math.pow(b, d);
    }
    genPersonalReleasePlan(profitPool) {
        return Array.from({ length: PERSONAL_DAYS }, (_, i) => ({
            day: i + 1,
            amount: +this.calcPersonalRelease(profitPool, i + 1).toFixed(4),
        }));
    }
};
exports.ProfitEngineService = ProfitEngineService;
exports.ProfitEngineService = ProfitEngineService = __decorate([
    (0, common_1.Injectable)()
], ProfitEngineService);
//# sourceMappingURL=profit-engine.service.js.map