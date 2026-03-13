import { Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_role_dept')
export class SysRoleDeptEntity {
  @PrimaryColumn({ name: 'role_id', type: 'bigint' })
  roleId: number;

  @PrimaryColumn({ name: 'dept_id', type: 'bigint' })
  deptId: number;
}
