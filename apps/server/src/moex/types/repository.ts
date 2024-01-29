import { MoexBoard, MoexEngine, MoexMarket } from 'contracts';

type MoexRepoCreateSecurity = {
  ticker: string;
  name: string;
  shortName: string;
  engine: MoexEngine;
  board: MoexBoard;
  market: MoexMarket;
};

export type MoexRepoCreateShare = MoexRepoCreateSecurity;

export type MoexRepoCreateBond = MoexRepoCreateSecurity;

export type MoexRepoCreateCurrency = MoexRepoCreateSecurity;
