import { Exchange, DealType } from '../other/enums'

export interface IDealResponse {
	amount: number;
	date: Date;
	exchange: Exchange;
	id: number;
	portfolioId: number;
  price: number;
	securityId: number;
	ticker: string;
  type: DealType;
}