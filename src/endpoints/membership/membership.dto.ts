import { IsNotEmpty, IsString, IsEmail, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class MembershipDto {
  @IsNotEmpty()
  @IsString()
  status: string;
}
