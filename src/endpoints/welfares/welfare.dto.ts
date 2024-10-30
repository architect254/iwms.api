import { IsString, IsEmail, ValidateIf, IsOptional } from 'class-validator';
import { MemberDto } from '../users/dtos';

export class specialMemberDto extends MemberDto {}
export class WelfareDto {
  @ValidateIf(
    (welfare) => !(welfare.name || welfare.phone_number || welfare.email),
  )
  @IsString()
  id: string;

  @ValidateIf((welfare) => !welfare.id)
  @IsString()
  name: string;

  @ValidateIf((welfare) => !welfare.id)
  @IsString()
  phone_number: string;

  @ValidateIf((welfare) => !welfare.id)
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  logo_image: string;
}
