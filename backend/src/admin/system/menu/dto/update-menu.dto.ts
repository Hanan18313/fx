import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMenuDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parentId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  type?: number;

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
