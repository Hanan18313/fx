import { Injectable } from '@nestjs/common';

const a = 0.55;
const b = 1.06;
const PERSONAL_DAYS = 30;
const TEAM_DAYS = 36;

// 30天权重归一化总和
const S1 = Array.from({ length: PERSONAL_DAYS }, (_, i) => Math.pow(a, i + 1))
  .reduce((sum, v) => sum + v, 0);

@Injectable()
export class ProfitEngineService {
  /** 计算第 t 天的个人释放金额（t 从 1 开始） */
  calcPersonalRelease(profitPool: number, t: number): number {
    if (t < 1 || t > PERSONAL_DAYS) return 0;
    return profitPool * (Math.pow(a, t) / S1);
  }

  /** 计算第 d 天的团队分红权重（d 从 1 开始） */
  calcTeamWeight(d: number): number {
    if (d < 1 || d > TEAM_DAYS) return 0;
    return Math.pow(b, d);
  }

  /** 生成 30 天个人释放计划（用于预览） */
  genPersonalReleasePlan(profitPool: number) {
    return Array.from({ length: PERSONAL_DAYS }, (_, i) => ({
      day: i + 1,
      amount: +this.calcPersonalRelease(profitPool, i + 1).toFixed(4),
    }));
  }
}
