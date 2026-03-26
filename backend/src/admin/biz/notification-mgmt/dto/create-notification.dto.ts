import { IsString, IsNumber, IsEnum } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  userId: number;

  @IsEnum(['system', 'order', 'profit'])
  type: string;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
