import { Exchange, OpinionType, SecurityType } from '../other/enums';
import { IExpertResponse } from './expert';

export type IOpinionResponse = {
	date: Date;
  exchange: Exchange;
  expertId: number;
  expert?: IExpertResponse;
  text: string;
  id: number;
  securityType: SecurityType;
  securityId: number;
  sourceLink?: string;
  type: OpinionType;
}