export declare class CreateAdminDto {
    username: string;
    password: string;
    realName?: string;
    email?: string;
    phone?: string;
    deptId?: number;
    roleIds: number[];
    status?: number;
}
