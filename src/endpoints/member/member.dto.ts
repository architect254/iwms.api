import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { MemberRole, MemberStatus } from './member.entity';

export class MemberDto {
  @IsNotEmpty()
  // @IsEnum(MemberRole)
  @IsString()
  role: string;

  @IsNotEmpty()
  // @IsEnum(MemberStatus)
  @IsString()
  status: string;
}
