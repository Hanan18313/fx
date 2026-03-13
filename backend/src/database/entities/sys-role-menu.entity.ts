import { Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_role_menu')
export class SysRoleMenuEntity {
  @PrimaryColumn({ name: 'role_id', type: 'bigint' })
  roleId: number;

  @PrimaryColumn({ name: 'menu_id', type: 'bigint' })
  menuId: number;
}
