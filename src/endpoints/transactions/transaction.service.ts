import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from './transaction.entity';
import { SearchQueryDto, TransactionDto } from './transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async create(payload: TransactionDto): Promise<Transaction> {
    const transaction = await this.transactionRepo.create(new Transaction());

    return this.upsert(transaction, payload);
  }

  async read(id): Promise<Transaction> {
    let transaction = null;

    try {
      transaction = await this.transactionRepo.findOne({
        where: { id },
      });
    } catch (error) {
      transaction = null;
    }

    if (!transaction || !Object.keys(transaction).length) {
      const errorMessage = `Transaction not found`;
      throw new NotFoundException(errorMessage);
    }

    return transaction;
  }

  async readAll(
    page: number,
    take: number,
    searchQueryParams: SearchQueryDto,
  ): Promise<Transaction[]> {
    const skip: number = Number(take * (page - 1));

    let transactions = [];

    try {
      transactions = await this.transactionRepo.find({
        skip,
        take,
        where: searchQueryParams,
      });
    } catch (error) {
      transactions = [];
    }

    return transactions;
  }

  async update(id, payload: TransactionDto): Promise<Transaction> {
    const transaction = await this.read(id);
    return this.upsert(transaction, payload);
  }

  async upsert(
    transaction: Transaction,
    payload: TransactionDto,
  ): Promise<Transaction> {
    Object.assign(transaction, payload);

    transaction.status = TransactionStatus.Committed;

    await this.transactionRepo.save(transaction);

    return transaction;
  }

  async drop(id): Promise<void> {
    const transaction: Transaction = await this.read(id);
    const result = await this.transactionRepo.softRemove(transaction);

    if (!result) {
      const errorMessage = `Operation Failed:DELETE`;
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async save(transaction: Transaction): Promise<Transaction> {
    try {
      return await this.transactionRepo.save(transaction);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('Transaction Exists');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
