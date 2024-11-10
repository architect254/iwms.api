import { IsCurrency, IsEnum, IsString } from 'class-validator';
import { ExpenditureType } from '../entities/expenditure.entity';

class ExpenditureDto {
  @IsString()
  fromAccountId: string;

  @IsString()
  welfareId: string;

  @IsCurrency({ allow_decimal: false, allow_negatives: false })
  amount: number;

  @IsString()
  for: string;

  @IsEnum(ExpenditureType)
  type: ExpenditureType;
}

export class InternalFundsTransferExpenditureDto extends ExpenditureDto {
  @IsString()
  toAccountId: string;
}

export class ExternalFundsTransferExpenditureDto extends ExpenditureDto {
  @IsString()
  toAccountNumber: string;
}
