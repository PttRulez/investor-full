import { Transaction as DbTransaction } from 'database';
import { ITransactionResponse, TransactionType } from 'contracts';

export class Transaction {
  amount: number;
  date: Date;
  id: number;
  portfolioId: number;
  type: TransactionType;

  constructor(dbModel: DbTransaction) {
    this.amount = dbModel.amount;
    this.date = dbModel.date;
    this.id = dbModel.id;
    this.portfolioId = dbModel.portfolioId;
    this.type = dbModel.type as TransactionType;
  }

  toJSON(): ITransactionResponse {
    return {
      id: this.id,
      amount: this.amount,
      date: this.date,
      type: TransactionType.CASHOUT,
    };
  }
}
