import { Type } from 'class-transformer';
import { IsString, IsDate } from 'class-validator';

export class ChildDto {
  @IsString()
  name: string;

  @IsString()
  gender: string;

  @IsDate()
  @Type(() => Date)
  birth_date: Date;
}
