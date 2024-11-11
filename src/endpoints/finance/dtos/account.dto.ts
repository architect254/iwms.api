import { IsCurrency, IsEnum, IsString } from 'class-validator';
import { AccountType } from '../entities/account.entity';

class AccountDto {
  @IsEnum(AccountType)
  type: AccountType;

  @IsString()
  name: string;

  @IsString()
  welfareName: string;

  @IsCurrency({ allow_decimal: false, allow_negatives: false })
  base_amount: number;
}
export class BankAccountDto extends AccountDto {
  @IsString()
  number: string;
}
export class PettyCashAccountDto extends AccountDto {}
