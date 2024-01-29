import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.model';
import { CreateTransactionDto, UpdateTransactionDto } from './transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  create(transactionData: CreateTransactionDto): Promise<Transaction> {
    return this.transactionRepository.create(transactionData);
  }

  async delete(id: number) {
    return this.transactionRepository.deleteById(id);
  }

  async update(transactionData: UpdateTransactionDto) {
    const foundDepoist = await this.transactionRepository.findById(
      transactionData.id,
    );

    if (!foundDepoist)
      throw new NotFoundException("Transaction with this id doesn't exist");

    return this.transactionRepository.update(transactionData);
  }
}
