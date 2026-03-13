import { IsString, IsOptional, IsNumber, IsNotEmpty, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMenuDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parentId?: number;

  @IsString()
  @IsNotEmpty({ message: '菜单名称不能为空' })
  @MaxLength(50)
  name: string;

  @IsNumber()
  @Type(() => Number)
  type: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  permission?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  path?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  component?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sort?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  visible?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status?: number;
}
