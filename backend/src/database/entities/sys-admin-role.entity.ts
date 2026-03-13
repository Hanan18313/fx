import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('sys_admin_role')
export class SysAdminRoleEntity {
  @PrimaryColumn({ name: 'admin_id', type: 'bigint' })
  adminId: number;

  @PrimaryColumn({ name: 'role_id', type: 'bigint' })
  roleId: number;
}
