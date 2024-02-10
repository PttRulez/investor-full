import { PrismaPortfolio, PortfolioWithRelations } from './types';
import { Deal } from 'src/deal/deal.model';
import {
  IPortfolioListResponse,
  IPortfolioResponse,
  TransactionType,
} from 'contracts';
import { Transaction } from 'src/transaction/transaction.model';
import { Position } from 'src/position/position.model';
import { PositionService } from 'src/position/position.service';

export class Portfolio {
  compound: boolean;
  deals: Array<Deal>;
  id: number;
  name: string;
  positions: Position[];
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
    this.positions = dbModel.positions
      ? dbModel.positions.map(p => new Position(p))
      : [];
  }

  belongsToUser(userId: number) {
    return userId === this.userId;
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

  async toJSON(positionService: PositionService): Promise<IPortfolioResponse> {
    const { bondPositions, sharePositions } =
      await positionService.hydratePositionsForPortfolio(this.positions);
    const allPositions = bondPositions.concat(sharePositions);

    const positions = {
      allPositions,
      bondPositions,
      bondsTotal: bondPositions.reduce((acc, p) => acc + p.total, 0),
      sharePositions,
      sharesTotal: sharePositions.reduce((acc, p) => acc + p.total, 0),
    };

    const cashoutsSum = this.sumCashouts();
    const depositsSum = this.sumDeposits();
    const total = positions.bondsTotal + positions.sharesTotal;
    const profitability =
      (((total + cashoutsSum) / depositsSum - 1) * 100).toLocaleString(
        'ru-RU',
        {
          maximumFractionDigits: 1,
        },
      ) + '%';

    return {
      cash: 0,
      cashoutsSum,
      compound: this.compound,
      deals: this.deals.map(d => d.toJSON()),
      depositsSum,
      id: this.id,
      name: this.name,
      positions,
      total,
      transactions: this.transactions
        .sort((a, b) => (a.date > b.date ? 1 : -1))
        .map(t => t.toJSON()),
      profitability,
    };
  }
}
