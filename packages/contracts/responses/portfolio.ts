import { IDealResponse } from "./deal";
import { ITransactionResponse } from "./transaction";
import { SecurityResponse } from "./security";

export interface IPortfolioResponse {
  cash: number;
  cashoutsSum: number;
  compound: boolean;
  deals: IDealResponse[];
  depositsSum: number;
  id: number;
  name: string;
  positions: IPortfolioPositionsResponse;
  profitability: string;
  total: number;
  transactions: ITransactionResponse[];
}

export type IPortfolioListResponse = Pick<
  IPortfolioResponse,
  "id" | "name" | "compound"
>;

export interface IPositionResponse {
  amount: number;
  currentPrice: number;
  tradeSaldo: number;
  security: SecurityResponse;
  total: number;
}

export interface IPortfolioPositionsResponse {
  allPositions: Array<IPositionResponse>;
  bondPositions: Array<IPositionResponse>;
  bondsTotal: number;
  // tradeSaldo?: number;
  sharePositions: Array<IPositionResponse>;
  sharesTotal: number;
}
