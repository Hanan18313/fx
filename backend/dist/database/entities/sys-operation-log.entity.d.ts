export declare class SysOperationLogEntity {
    id: number;
    adminId: number;
    adminName: string;
    module: string;
    action: string;
    method: string;
    url: string;
    requestBody: any;
    responseCode: number;
    ip: string;
    userAgent: string;
    durationMs: number;
    status: number;
    errorMsg: string;
    createdAt: Date;
}
