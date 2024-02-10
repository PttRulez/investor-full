import {
  Exchange,
  IPositionResponse,
  SecurityResponse,
  SecurityType,
} from 'contracts';
import { PrismaPosition, PrismaPositionWithRelations } from './types';
import { Security } from 'src/types';

export class Position {
  amount: number;
  averagePrice: number;
  comment: string | null;
  #currentPrice: number = 0;
  exchange: Exchange;
  id: number;
  portfolioId: number;
  securityId: number;
  securityType: SecurityType;
  #security?: Security;
  tradeSaldo: number;
  targetPrice: number | null;
  #total: number = 0;

  constructor(dbModel: PrismaPosition);
  constructor(dbModel: PrismaPositionWithRelations) {
    this.amount = dbModel.amount;
    this.averagePrice = dbModel.averagePrice;
    this.comment = dbModel.comment;
    this.exchange = dbModel.exchange as Exchange;
    this.id = dbModel.id;
    this.portfolioId = dbModel.portfolioId;
    this.securityType = dbModel.securityType as SecurityType;
    this.securityId = dbModel.securityId;
    this.targetPrice = dbModel.targetPrice;
    this.tradeSaldo = dbModel.tradeSaldo;
  }

  // Setters & getter
  set currentPrice(p: number) {
    this.#currentPrice = p;
  }
  set security(s: Security) {
    this.#security = s;
  }
  get security(): Security | undefined {
    return this.#security;
  }
  set total(t: number) {
    this.#total = t;
  }

  // API Functions
  toJSON(): IPositionResponse {
    return {
      amount: this.amount,
      comment: this.comment ?? '',
      currentPrice: this.#currentPrice,
      id: this.id,
      security: this.#security
        ? this.#security.toJSON()
        : ({} as SecurityResponse),
      targetPrice: this.targetPrice,
      tradeSaldo: this.tradeSaldo,
      total: this.#total,
    };
  }
}
