import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import * as bcrypt from "bcryptjs";
import { SysAdminEntity } from "../../../database/entities/sys-admin.entity";
import { SysAdminRoleEntity } from "../../../database/entities/sys-admin-role.entity";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(SysAdminEntity)
    private readonly adminRepo: Repository<SysAdminEntity>,
    @InjectRepository(SysAdminRoleEntity)
    private readonly adminRoleRepo: Repository<SysAdminRoleEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async list(query: {
    page?: number;
    pageSize?: number;
    username?: string;
    realName?: string;
    phone?: string;
    status?: number;
    deptId?: number;
  }) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;

    // 构建 WHERE 条件
    let whereSql = "a.deleted_at IS NULL";
    const params: any[] = [];

    if (query.username) {
      whereSql += " AND a.username LIKE ?";
      params.push(`%${query.username}%`);
    }
    if (query.realName) {
      whereSql += " AND a.real_name LIKE ?";
      params.push(`%${query.realName}%`);
    }
    if (query.phone) {
      whereSql += " AND a.phone LIKE ?";
      params.push(`%${query.phone}%`);
    }
    if (query.status !== undefined && query.status !== null) {
      whereSql += " AND a.status = ?";
      params.push(query.status);
    }
    if (query.deptId) {
      whereSql += " AND a.dept_id = ?";
      params.push(query.deptId);
    }

    console.log("WHERE SQL:", whereSql, query);

    // 查询总数
    const [countRow] = await this.dataSource.query(
      `SELECT COUNT(*) AS total FROM sys_admin a WHERE ${whereSql}`,
      params,
    );
    const total = Number(countRow.total);

    // 查询列表
    const list = await this.dataSource.query(
      `SELECT a.id, a.username, a.real_name AS realName, a.email, a.phone,
              a.avatar, a.dept_id AS deptId, d.name AS deptName,
              a.status, a.last_login_at AS lastLoginAt, a.created_at AS createdAt
       FROM sys_admin a
       LEFT JOIN sys_dept d ON d.id = a.dept_id
       WHERE ${whereSql}
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, (page - 1) * pageSize],
    );

    // 查询每个管理员的角色
    if (list.length > 0) {
      const adminIds = list
        .map((item: any) => Number(item.id))
        .filter((id: number) => !isNaN(id));
      if (adminIds.length > 0) {
        const placeholders = adminIds.map(() => "?").join(",");
        const roles = await this.dataSource.query(
          `SELECT ar.admin_id AS adminId, r.id, r.name, r.code
           FROM sys_admin_role ar
           JOIN sys_role r ON r.id = ar.role_id
           WHERE ar.admin_id IN (${placeholders})`,
          adminIds,
        );
        const roleMap = new Map<number, any[]>();
        for (const role of roles) {
          const arr = roleMap.get(Number(role.adminId)) || [];
          arr.push({ id: Number(role.id), name: role.name, code: role.code });
          roleMap.set(Number(role.adminId), arr);
        }
        for (const item of list) {
          item.id = Number(item.id);
          item.deptId = item.deptId != null ? Number(item.deptId) : null;
          item.roles = roleMap.get(item.id) || [];
        }
      }
    }

    return { list, total, page, pageSize };
  }

  async create(dto: CreateAdminDto, createdBy: number) {
    // 检查用户名唯一
    const exists = await this.adminRepo.findOne({
      where: { username: dto.username },
    });
    if (exists) {
      throw new Error("用户名已存在");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const admin = this.adminRepo.create({
      username: dto.username,
      password: hashedPassword,
      realName: dto.realName,
      email: dto.email,
      phone: dto.phone,
      deptId: dto.deptId,
      status: dto.status ?? 1,
      createdBy,
    });

    const saved = await this.adminRepo.save(admin);

    // 保存角色关系
    if (dto.roleIds && dto.roleIds.length > 0) {
      const adminRoles = dto.roleIds.map((roleId) =>
        this.adminRoleRepo.create({ adminId: saved.id, roleId }),
      );
      await this.adminRoleRepo.save(adminRoles);
    }

    return { id: saved.id };
  }

  async update(id: number, dto: UpdateAdminDto) {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin || admin.deletedAt) {
      throw new Error("管理员不存在");
    }

    // 更新基本字段
    if (dto.realName !== undefined) admin.realName = dto.realName;
    if (dto.email !== undefined) admin.email = dto.email;
    if (dto.phone !== undefined) admin.phone = dto.phone;
    if (dto.deptId !== undefined) admin.deptId = dto.deptId;
    if (dto.status !== undefined) admin.status = dto.status;

    await this.adminRepo.save(admin);

    // 更新角色关系
    if (dto.roleIds !== undefined) {
      await this.adminRoleRepo.delete({ adminId: id });
      if (dto.roleIds.length > 0) {
        const adminRoles = dto.roleIds.map((roleId) =>
          this.adminRoleRepo.create({ adminId: id, roleId }),
        );
        await this.adminRoleRepo.save(adminRoles);
      }
    }

    return { id };
  }

  async resetPassword(id: number, newPassword: string) {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin || admin.deletedAt) {
      throw new Error("管理员不存在");
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await this.adminRepo.save(admin);

    return { id };
  }
}
