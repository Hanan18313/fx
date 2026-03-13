import { IsString, IsOptional, IsNumber, IsNotEmpty, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: '角色名称不能为空' })
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty({ message: '角色编码不能为空' })
  @MaxLength(50)
  code: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  dataScope?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sort?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status?: number;
}
