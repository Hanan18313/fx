export declare class ProfitEngineService {
    calcPersonalRelease(profitPool: number, t: number): number;
    calcTeamWeight(d: number): number;
    genPersonalReleasePlan(profitPool: number): {
        day: number;
        amount: number;
    }[];
}
