import {
  DealPrismaCreateData,
  DealPrismaUpdateData,
  PrismaDeal,
} from './types/repo';
import { Portfolio } from 'src/portfolio/portfolio.model';
import { PrismaDealWithRelations } from './types/repo';
import { IDealResponse, DealType, Exchange, SecurityType } from 'contracts';
import { CreateDealDto } from './deal.dto';

type DealConstructorData = PrismaDeal | PrismaDealWithRelations | CreateDealDto;

export class Deal {
  amount: number;
  date: Date;
  exchange: Exchange;
  id?: number;
  portfolioId: number;
  portfolio?: Portfolio;
  price: number;
  securityId: number = 0;
  securityType: SecurityType;
  ticker: string;
  type: DealType;

  constructor(data: DealConstructorData) {
    this.amount = data.amount;
    this.date = data.date;
    this.exchange = data.exchange as Exchange;
    this.portfolioId = data.portfolioId;
    this.price = Number(data.price);
    this.securityType = data.securityType as SecurityType;
    this.ticker = data.ticker;
    this.type = data.type as DealType;

    if ('securityId' in data) {
      this.securityId = data.securityId;
    }

    // Data from Prisma Received
    const conditionalProps = ['id', 'securityId'];
    for (const prop of conditionalProps) {
      if (prop in data) {
        this[prop] = data[prop];
      }
    }

    if ('portfolio' in data) {
      this.portfolio = new Portfolio(data.portfolio);
    }
  }

  setSecurityId(id: number) {
    this.securityId = id;
  }

  isShare() {
    return this.securityType === SecurityType.SHARE;
  }

  isBond() {
    return this.securityType === SecurityType.BOND;
  }

  forPrismaCreate(): DealPrismaCreateData {
    return {
      amount: this.amount,
      date: this.date,
      exchange: this.exchange,
      portfolioId: this.portfolioId,
      price: this.price,
      securityType: this.securityType,
      securityId: this.securityId,
      ticker: this.ticker,
      type: this.type,
    };
  }

  forPrismaUpdate(): DealPrismaUpdateData {
    return {
      ...this.forPrismaCreate(),
      id: this.id!,
    };
  }

  toJSON(): IDealResponse {
    const json: IDealResponse = {
      id: this.id!,
      securityId: this.securityId,
      exchange: this.exchange,
      amount: this.amount,
      price: this.price,
      ticker: this.ticker,
      type: this.type,
      date: this.date,
      portfolioId: this.portfolioId,
    };

    return json;
  }
}
