import { IsArray, IsNumber } from 'class-validator';

export class AssignMenusDto {
  @IsArray()
  @IsNumber({}, { each: true })
  menuIds: number[];
}
