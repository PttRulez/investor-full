import { TransactionType } from '../other/enums';

export interface ITransactionResponse {
	id: number;
	amount: number;
	type: TransactionType;
	date: Date;
}