import { MoexCurrency as PrismaMoexCurrency } from 'database';
import {
  IMoexSecurtiyResponse,
  MoexBoard,
  MoexEngine,
  MoexMarket,
  SecurityType,
} from 'contracts';

export class MoexCurrency {
  board: MoexBoard;
  currentPrice: number = 0;
  engine: MoexEngine;
  id: number;
  market: MoexMarket;
  name: string;
  shortName: string;
  ticker: string;

  constructor(data: PrismaMoexCurrency) {
    this.id = data.id;
    this.ticker = data.ticker;
    this.name = data.name;
    this.shortName = data.shortName;
    this.engine = data.engine as MoexEngine;
    this.board = data.board as MoexBoard;
    this.market = data.market as MoexMarket;
  }

  toJSON(): IMoexSecurtiyResponse {
    return {
      board: this.board,
      engine: this.engine,
      id: this.id,
      market: this.market,
      name: this.name,
      shortName: this.shortName,
      securityType: SecurityType.CURRENCY,
      ticker: this.ticker,
    };
  }
}
