import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Transaction } from './transaction.model';
import { CreateTransactionDto, UpdateTransactionDto } from './transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(private prisma: PrismaService) {}

  async findById(transactionId: number): Promise<Transaction | null> {
    const foundTransaction = await this.prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });

    if (!foundTransaction) return null;

    return new Transaction(foundTransaction);
  }

  async create(transactionData: CreateTransactionDto): Promise<Transaction> {
    const newTransaction = await this.prisma.transaction.create({
      data: {
        ...transactionData,
      },
    });

    return new Transaction(newTransaction);
  }

  async update(transactionData: UpdateTransactionDto): Promise<Transaction> {
    const newTransaction = await this.prisma.transaction.update({
      where: {
        id: transactionData.id,
      },
      data: {
        ...transactionData,
      },
    });

    return new Transaction(newTransaction);
  }

  async deleteById(transactionId: number): Promise<Transaction> {
    const deleted = await this.prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    return new Transaction(deleted);
  }
}
