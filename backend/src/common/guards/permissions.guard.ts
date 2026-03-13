import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const admin = request.user;
    if (!admin) throw new ForbiddenException('未登录');

    // super_admin 拥有全部权限
    const roleCodes: string[] = admin.roleCodes || [];
    if (roleCodes.includes('super_admin')) {
      return true;
    }

    // 查询该管理员的所有权限标识
    const permissions = await this.getAdminPermissions(admin.id);
    admin.permissions = permissions;

    const hasPermission = requiredPermissions.every((p) =>
      permissions.includes(p),
    );

    if (!hasPermission) {
      throw new ForbiddenException('没有操作权限');
    }
    return true;
  }

  private async getAdminPermissions(adminId: number): Promise<string[]> {
    const rows = await this.dataSource.query(
      `SELECT DISTINCT m.permission
       FROM sys_admin_role ar
       JOIN sys_role_menu rm ON rm.role_id = ar.role_id
       JOIN sys_menu m ON m.id = rm.menu_id
       WHERE ar.admin_id = ? AND m.permission IS NOT NULL AND m.status = 1`,
      [adminId],
    );
    return rows.map((r) => r.permission);
  }
}
