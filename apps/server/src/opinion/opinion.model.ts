import {
  Exchange,
  OpinionType,
  SecurityType,
  IOpinionResponse,
} from 'contracts';
import { Expert } from 'src/expert/expert.model';
import { PrismaOpinion, PrismaOpinionWithRelations } from './types';

export class Opinion {
  date: Date;
  exchange: Exchange;
  expertId: number;
  expert?: Expert;
  text: string;
  id: number;
  securityType: SecurityType;
  securityId: number;
  sourceLink?: string;
  type: OpinionType;

  constructor(opinion: PrismaOpinion);
  constructor(opinion: PrismaOpinionWithRelations) {
    this.date = opinion.date;
    this.exchange = opinion.exchange as Exchange;
    this.expertId = opinion.expertId;
    if (opinion.expert) {
      this.expert = new Expert(opinion.expert);
    }
    this.text = opinion.text;
    this.id = opinion.id;
    this.securityType = opinion.securityType as SecurityType;
    this.securityId = opinion.securityId;
    if (opinion.sourceLink) {
      this.sourceLink = opinion.sourceLink;
    }
    this.type = opinion.type as OpinionType;
  }

  toJSON(): IOpinionResponse {
    return this;
  }
}
