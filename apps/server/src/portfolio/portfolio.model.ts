import {
  PrismaPortfolio,
  PortfolioWithRelations,
  PortfolioPositions,
} from './types';
import { Deal } from 'src/deal/deal.model';
import {
  IPortfolioListResponse,
  IPortfolioResponse,
  TransactionType,
} from 'contracts';
import { Transaction } from 'src/transaction/transaction.model';

export class Portfolio {
  bondsTotal: number = 0;
  cash: number = 0;
  cashoutsSum: number = 0;
  compound: boolean;
  deals: Array<Deal>;
  depositsSum: number = 0;
  id: number;
  name: string;
  positions?: PortfolioPositions;
  profitability: string = '0%';
  sharesTotal: number = 0;
  total: number = 0;
  transactions: Array<Transaction>;
  userId: number;

  constructor(dbModel: PrismaPortfolio);
  constructor(dbModel: PortfolioWithRelations) {
    this.id = dbModel.id;
    this.name = dbModel.name;
    this.compound = dbModel.compound;
    this.userId = dbModel.userId;

    this.transactions =
      'transactions' in dbModel
        ? dbModel.transactions.map(d => new Transaction(d))
        : [];

    this.deals = 'deals' in dbModel ? dbModel.deals.map(d => new Deal(d)) : [];
  }

  belongsToUser(userId: number) {
    return userId === this.userId;
  }

  loadPositions(positions: PortfolioPositions): void {
    this.positions = positions;
    this.total = positions.bondsTotal + positions.sharesTotal;

    this.cashoutsSum = this.sumCashouts();
    this.depositsSum = this.sumDeposits();

    this.cash =
      this.depositsSum -
      this.cashoutsSum +
      positions.bonds
        .concat(positions.shares)
        .reduce((total, cur) => total + cur.tradeSaldo, 0);

    this.profitability =
      (this.depositsSum
        ? ((this.total + this.cash + this.cashoutsSum) / this.depositsSum - 1) *
          100
        : 0
      ).toFixed(1) + '%';
  }

  sumCashouts(): number {
    return this.transactions
      .filter(tr => tr.type === TransactionType.CASHOUT)
      .reduce<number>((prev, cur) => {
        return prev + cur.amount;
      }, 0);
  }

  sumDeposits(): number {
    return this.transactions
      .filter(tr => tr.type === TransactionType.DEPOSIT)
      .reduce<number>((prev, cur) => {
        return prev + cur.amount;
      }, 0);
  }

  toListJSON(): IPortfolioListResponse {
    return {
      id: this.id,
      compound: this.compound,
      name: this.name,
    };
  }

  toJSON(): IPortfolioResponse {
    const positions = this.positions
      ? this.positions.toJSON()
      : {
          allPositions: [],
          tradeSaldo: 0,
          sharePositions: [],
          bondPositions: [],
          sharesTotal: 0,
          bondsTotal: 0,
        };

    return {
      cash: this.cash,
      cashoutsSum: this.cashoutsSum,
      compound: this.compound,
      deals: this.deals.map(d => d.toJSON()),
      depositsSum: this.depositsSum,
      id: this.id,
      name: this.name,
      positions,
      total: this.total,
      transactions: this.transactions
        .sort((a, b) => (a.date > b.date ? 1 : -1))
        .map(t => t.toJSON()),
      profitability: this.profitability,
    };
  }
}
