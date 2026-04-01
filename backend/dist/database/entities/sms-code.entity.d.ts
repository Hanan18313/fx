export declare class SmsCodeEntity {
    id: number;
    phone: string;
    code: string;
    scene: string;
    used: number;
    expiredAt: Date;
    createdAt: Date;
}
