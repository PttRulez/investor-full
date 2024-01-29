import { MoexShare as PrismaMoexShare } from 'database';
import {
  IMoexSecurtiyResponse,
  MoexBoard,
  MoexEngine,
  MoexMarket,
  SecurityType,
} from 'contracts';

export class MoexShare {
  board: MoexBoard;
  currentPrice: number = 0;
  engine: MoexEngine;
  id: number;
  market: MoexMarket;
  name: string;
  shortName: string;
  ticker: string;

  constructor(data: PrismaMoexShare) {
    this.board = data.board as MoexBoard;
    this.engine = data.engine as MoexEngine;
    this.id = data.id;
    this.market = data.market as MoexMarket;
    this.name = data.name;
    this.shortName = data.shortName;
    this.ticker = data.ticker;
  }

  toJSON(): IMoexSecurtiyResponse {
    return {
      board: this.board,
      engine: this.engine,
      id: this.id,
      market: this.market,
      name: this.name,
      shortName: this.shortName,
      securityType: SecurityType.SHARE,
      ticker: this.ticker,
    };
  }
}
