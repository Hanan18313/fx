import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SysAdminEntity } from '../../database/entities/sys-admin.entity';
import { SysLoginLogEntity } from '../../database/entities/sys-login-log.entity';
import { TokenBlacklistService } from '../../common/services/token-blacklist.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(SysAdminEntity)
    private readonly adminRepo: Repository<SysAdminEntity>,
    @InjectRepository(SysLoginLogEntity)
    private readonly loginLogRepo: Repository<SysLoginLogEntity>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async login(dto: AdminLoginDto, ip?: string, userAgent?: string) {
    const admin = await this.adminRepo.findOne({
      where: { username: dto.username, deletedAt: null },
    });

    if (!admin) {
      // Record failed login log
      await this.loginLogRepo.save(
        this.loginLogRepo.create({
          username: dto.username,
          ip,
          userAgent,
          status: 0,
          message: '账号不存在',
        }),
      );
      throw new UnauthorizedException('用户名或密码错误');
    }

    const match = await bcrypt.compare(dto.password, admin.password);
    if (!match) {
      await this.loginLogRepo.save(
        this.loginLogRepo.create({
          adminId: admin.id,
          username: dto.username,
          ip,
          userAgent,
          status: 0,
          message: '密码错误',
        }),
      );
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (admin.status !== 1) {
      await this.loginLogRepo.save(
        this.loginLogRepo.create({
          adminId: admin.id,
          username: dto.username,
          ip,
          userAgent,
          status: 0,
          message: '账号已被禁用',
        }),
      );
      throw new UnauthorizedException('账号已被禁用');
    }

    // Record success login log
    await this.loginLogRepo.save(
      this.loginLogRepo.create({
        adminId: admin.id,
        username: admin.username,
        ip,
        userAgent,
        status: 1,
        message: '登录成功',
      }),
    );

    // Update last login info
    await this.adminRepo.update(admin.id, {
      lastLoginAt: new Date(),
      lastLoginIp: ip,
    });

    const token = this.jwtService.sign({
      id: admin.id,
      username: admin.username,
      type: 'admin',
    });

    return { token };
  }

  async logout(token: string, adminId: number, username: string, ip?: string, userAgent?: string) {
    // 解析 token 获取过期时间，加入黑名单
    const decoded = this.jwtService.decode(token) as { exp: number };
    if (decoded?.exp) {
      await this.tokenBlacklistService.addToBlacklist(token, decoded.exp);
    }

    // 记录退出日志
    await this.loginLogRepo.save(
      this.loginLogRepo.create({
        adminId,
        username,
        ip,
        userAgent,
        status: 1,
        message: '退出登录',
      }),
    );
  }

  async getProfile(adminId: number) {
    const admin = await this.adminRepo.findOne({
      where: { id: adminId, deletedAt: null },
    });

    if (!admin) {
      throw new UnauthorizedException('管理员不存在');
    }

    // Query all menus associated with the admin's roles
    const menus = await this.dataSource.query(
      `SELECT DISTINCT m.*
       FROM sys_admin_role ar
       JOIN sys_role_menu rm ON rm.role_id = ar.role_id
       JOIN sys_menu m ON m.id = rm.menu_id AND m.status = 1
       JOIN sys_role r ON r.id = ar.role_id AND r.status = 1
       WHERE ar.admin_id = ?
       ORDER BY m.sort ASC, m.id ASC`,
      [adminId],
    );

    // Extract permissions (type 3 = button permissions)
    const permissions: string[] = menus
      .filter((m: any) => Number(m.type) === 3 && m.permission)
      .map((m: any) => m.permission);

    // Build menu tree (type 1=directory, 2=menu only, exclude type 3=buttons)
    const menuItems = menus
      .filter((m: any) => Number(m.type) === 1 || Number(m.type) === 2)
      .map((m: any) => ({
        id: Number(m.id),
        parentId: Number(m.parent_id),
        name: m.name,
        type: Number(m.type),
        path: m.path,
        component: m.component,
        icon: m.icon,
        sort: Number(m.sort),
        visible: m.visible,
        children: [] as any[],
      }));

    const menuTree = this.buildTree(menuItems);

    return {
      id: admin.id,
      username: admin.username,
      realName: admin.realName,
      email: admin.email,
      phone: admin.phone,
      avatar: admin.avatar,
      deptId: admin.deptId,
      permissions,
      menus: menuTree,
    };
  }

  private buildTree(items: any[], parentId = 0): any[] {
    const tree: any[] = [];
    for (const item of items) {
      if (item.parentId === parentId) {
        const children = this.buildTree(items, item.id);
        if (children.length > 0) {
          item.children = children;
        }
        tree.push(item);
      }
    }
    return tree;
  }
}
