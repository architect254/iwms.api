import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityManager, Repository } from 'typeorm';
import { SearchQueryDto } from './finance.dto';
import { Account, Expenditure } from './entities';
import { UpdateContributionAmountDto } from './dtos';
import { Member } from '../members/entities';
import { Welfare } from '../welfares/welfare.entity';
import {
  ExpenditureType,
  ExternalFundsTransferExpenditure,
  InternalFundsTransferExpenditure,
} from './entities/expenditure.entity';
import {
  ExternalFundsTransferExpenditureDto,
  InternalFundsTransferExpenditureDto,
} from './dtos/expenditure.dto';
import {
  AccountType,
  BankAccount,
  PettyCashAccount,
} from './entities/account.entity';
import { BankAccountDto, PettyCashAccountDto } from './dtos/account.dto';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    @InjectRepository(BankAccount)
    private bankAccountRepo: Repository<BankAccount>,
    @InjectRepository(PettyCashAccount)
    private pettyCashAccountRepo: Repository<PettyCashAccount>,
    @InjectRepository(Expenditure)
    private expenditureRepo: Repository<Expenditure>,
    @InjectRepository(InternalFundsTransferExpenditure)
    private internalExpenditureRepo: Repository<InternalFundsTransferExpenditure>,
    @InjectRepository(ExternalFundsTransferExpenditure)
    private externalExpenditureRepo: Repository<ExternalFundsTransferExpenditure>,
    @InjectRepository(Welfare)
    private welfareRepo: Repository<Welfare>,
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) {}
  async readManyAccounts(
    page: number,
    take: number,
    queryParams: SearchQueryDto,
  ) {
    const skip: number = Number(take * (page - 1));
    let accounts: (BankAccount | PettyCashAccount)[];
    let { type } = queryParams;
    type = type as AccountType;
    switch (type) {
      case AccountType.Bank:
        accounts = await this.bankAccountRepo.find({
          skip,
          take,
          where: { type },
          relations: { welfare: true },
        });
        break;

      case AccountType.PettyCash:
        accounts = await this.pettyCashAccountRepo.find({
          skip,
          take,
          where: { type },
          relations: { welfare: true },
        });
        break;
    }
    return accounts;
  }
  async readAccount(id: string) {
    let account: BankAccount | PettyCashAccount = null;
    account = await this.bankAccountRepo.findOne({
      where: { id },
      relations: {
        welfare: true,
        contributions: true,
      },
    });

    if (!account) {
      account = await this.pettyCashAccountRepo.findOne({
        where: { id },
        relations: {
          welfare: true,
          contributions: true,
        },
      });
    }

    return account;
  }
  async getManyAccountsByWelfare(
    id: any,
    page: number,
    take: number,
    queryParams: SearchQueryDto,
  ) {
    const skip: number = Number(take * (page - 1));
    let accounts: (BankAccount | PettyCashAccount)[];
    const { type } = queryParams;
    switch (type) {
      case AccountType.Bank:
        accounts = await this.bankAccountRepo.find({
          skip,
          take,
          where: { welfare: { id } },
          relations: { contributions: true, welfare: true },
        });
        break;

      case AccountType.PettyCash:
        accounts = await this.pettyCashAccountRepo.find({
          skip,
          take,
          where: { welfare: { id } },
          relations: { contributions: true, welfare: true },
        });
        break;
    }
    return accounts;
  }
  createAccount(payload: BankAccountDto | PettyCashAccountDto) {
    const { type } = payload;
    let account: BankAccount | PettyCashAccount;

    return this.accountRepo.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        if (type == AccountType.Bank) {
          const { number } = payload as BankAccountDto;

          account = await transactionEntityManager.create(BankAccount);

          (account as BankAccount).number = number;
        } else if (type == AccountType.PettyCash) {
          account = await transactionEntityManager.create(PettyCashAccount);
        }

        Object.assign(account, payload);

        const { base_amount } = payload;
        account.current_amount = base_amount;
        account.contributions = [];
        account.expenditures = [];

        const { welfareName } = payload;
        const welfare = await transactionEntityManager.findOne(Welfare, {
          where: { name: welfareName },
        });

        account.welfare = welfare;

        account = await transactionEntityManager.save(account);

        return account;
      },
    );
  }
  async updateBereavementContributionAmount(
    id: string,
    { amount }: UpdateContributionAmountDto,
  ) {
    const welfare = await this.welfareRepo.findOne({ where: { id } });
    welfare.bereavedMemberContributionAmount = amount;

    return await this.welfareRepo.save(welfare);
  }

  async updateDeceasedContributionAmount(
    id: string,
    { amount }: UpdateContributionAmountDto,
  ) {
    const welfare = await this.welfareRepo.findOne({ where: { id } });
    welfare.deceasedMemberContributionAmount = amount;

    return await this.welfareRepo.save(welfare);
  }
  async updateMonthlyContributionAmount(
    id: string,
    { amount }: UpdateContributionAmountDto,
  ) {
    const welfare = await this.welfareRepo.findOne({ where: { id } });
    welfare.monthlyContributionAmount = amount;

    return await this.welfareRepo.save(welfare);
  }
  async updateMembershipContributionAmount(
    id: string,
    { amount }: UpdateContributionAmountDto,
  ) {
    const welfare = await this.welfareRepo.findOne({ where: { id } });
    welfare.membershipContributionAmount = amount;

    return await this.welfareRepo.save(welfare);
  }
  async readManyExpenditures(
    page: number,
    take: number,
    queryParams: SearchQueryDto,
  ) {
    const skip: number = Number(take * (page - 1));
    let expenditures: (
      | InternalFundsTransferExpenditure
      | ExternalFundsTransferExpenditure
    )[];
    const { type } = queryParams;
    switch (type) {
      case ExpenditureType.InternalFundsTransfer:
        expenditures = await this.internalExpenditureRepo.find({
          skip,
          take,
          relations: { from: true, to: true },
        });
        break;

      case ExpenditureType.ExternalFundsTransfer:
        expenditures = await this.externalExpenditureRepo.find({
          skip,
          take,
          relations: { from: true },
        });
        break;
    }
    return expenditures;
  }
  async readExpenditure(id: string) {
    let expenditure:
      | InternalFundsTransferExpenditure
      | ExternalFundsTransferExpenditure = null;
    expenditure = await this.externalExpenditureRepo.findOne({
      where: { id },
      relations: {
        from: true,
      },
    });

    if (!expenditure) {
      expenditure = await this.internalExpenditureRepo.findOne({
        where: { id },
        relations: {
          from: true,
          to: true,
        },
      });
    }

    return expenditure;
  }
  async getManyExpendituresByWelfare(
    id: any,
    page: number,
    take: number,
    queryParams: SearchQueryDto,
  ) {
    const skip: number = Number(take * (page - 1));
    let expenditures: (
      | InternalFundsTransferExpenditure
      | ExternalFundsTransferExpenditure
    )[];
    const { type } = queryParams;
    switch (type) {
      case ExpenditureType.InternalFundsTransfer:
        expenditures = await this.internalExpenditureRepo.find({
          skip,
          take,
          where: { from: { id } },
          relations: { from: true, to: true },
        });
        break;

      case ExpenditureType.ExternalFundsTransfer:
        expenditures = await this.externalExpenditureRepo.find({
          skip,
          take,
          where: { from: { id } },
          relations: { from: true },
        });
        break;
    }
    return expenditures;
  }
  createExpenditure(
    payload:
      | InternalFundsTransferExpenditureDto
      | ExternalFundsTransferExpenditureDto,
  ) {
    let expenditure:
      | InternalFundsTransferExpenditure
      | ExternalFundsTransferExpenditure;

    return this.expenditureRepo.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        const { type, fromAccountId } = payload;

        if (type == ExpenditureType.InternalFundsTransfer) {
          const { toAccountId } =
            payload as InternalFundsTransferExpenditureDto;

          expenditure = await transactionEntityManager.create(
            InternalFundsTransferExpenditure,
          );

          expenditure.to = await transactionEntityManager.findOne(Account, {
            where: { id: toAccountId },
          });
        } else {
          const { toAccountNumber } =
            payload as ExternalFundsTransferExpenditureDto;
          expenditure = await transactionEntityManager.create(
            ExternalFundsTransferExpenditure,
          );
          expenditure.to = toAccountNumber;
        }

        Object.assign(expenditure, payload);

        expenditure.from = await transactionEntityManager.findOne(Account, {
          where: { id: fromAccountId },
        });

        expenditure.from.current_amount =
          expenditure.from.current_amount - payload.amount;

        await transactionEntityManager.save(expenditure.from);

        const welfare = await transactionEntityManager.findOne(Welfare, {
          where: { id: expenditure.from.welfare.id },
        });

        welfare.totalExpendituresAmount =
          welfare.totalExpendituresAmount + payload.amount;

        welfare.totalContributionsAmount =
          welfare.totalContributionsAmount - payload.amount;

        await transactionEntityManager.save(welfare);

        expenditure = await transactionEntityManager.save(expenditure);

        return expenditure;
      },
    );
  }
}
