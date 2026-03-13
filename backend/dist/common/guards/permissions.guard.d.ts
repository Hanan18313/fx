import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
export declare class PermissionsGuard implements CanActivate {
    private readonly reflector;
    private readonly dataSource;
    constructor(reflector: Reflector, dataSource: DataSource);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getAdminPermissions;
}
