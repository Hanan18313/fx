import { IsString, IsOptional, IsNumber, IsArray, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  realName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deptId?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds?: number[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status?: number;
}
