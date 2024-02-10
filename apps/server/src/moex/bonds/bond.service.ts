import { ImATeapotException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IMoexApiResponseSecurityInfo, MoexRepoCreateBond } from '../types';
import { MoexBond } from './bond.model';
import { MoexApi } from '../iss-api/moex-api.service';
import { MoexMarket } from 'contracts';
import { Position } from 'src/position/position.model';

@Injectable()
export class MoexBondService {
  constructor(
    private prisma: PrismaService,
    private moexApi: MoexApi,
  ) {}

  async create(securityData: MoexRepoCreateBond): Promise<MoexBond> {
    const dbSecurity = await this.prisma.moexBond.create({
      data: securityData,
    });

    return new MoexBond(dbSecurity);
  }

  async getByTicker(ticker: string): Promise<MoexBond> {
    const bond = await this.prisma.moexBond.findUnique({
      where: {
        ticker,
      },
    });

    if (bond) {
      return new MoexBond(bond);
    } else {
      const dataFromMoex: IMoexApiResponseSecurityInfo =
        await this.moexApi.getSecurityByTicker(ticker);

      const name = dataFromMoex.description.data.find(
        arr => arr[0] === 'NAME',
      )?.[2];
      const shortName = dataFromMoex.description.data.find(
        arr => arr[0] === 'SHORTNAME',
      )?.[2];
      const boardData = dataFromMoex.boards.data.find(i => i[4] === 1);
      const engine = boardData?.[3];
      const market = boardData?.[2];
      const board = boardData?.[1];

      if (
        [name, shortName, boardData, board, market, engine].find(
          i => i === undefined,
        )
      ) {
        throw new ImATeapotException(
          `[${MoexBondService.name}]: Проблема с данными полученными в московской бирже`,
        );
      }

      const bond = await this.create({
        board,
        engine,
        market,
        name,
        shortName,
        ticker,
      } as MoexRepoCreateBond);

      return bond;
    }
  }

  async getBulk(ids: number[]): Promise<MoexBond[]> {
    const secs = await this.prisma.moexBond.findMany({
      where: { id: { in: ids } },
    });

    return secs.map(s => new MoexBond(s));
  }

  // async upsertPosition(portfolioId: number, securityId: number) {
  //   const deals = await this.prisma.deal.findMany({
  //     where: {
  //       exchange: Exchange.MOEX,
  //       securityType: SecurityType.BOND,
  //       portfolioId,
  //       securityId,
  //     },
  //   });

  //   const dealsSummary = deals.reduce(
  //     (acc, deal) => {
  //       acc.tradeSaldo +=
  //         (deal.type === DealType.SELL ? deal.amount : -deal.amount) *
  //         Number(deal.price);
  //       acc.amount += deal.type === DealType.BUY ? deal.amount : -deal.amount;
  //       acc.deals.push([deal.amount, deal.price]);
  //       return acc;
  //     },
  //     {
  //       amount: 0,
  //       averagePrice: 0,
  //       deals: [] as [number, number][],
  //       tradeSaldo: 0,
  //     },
  //   );

  //   dealsSummary.averagePrice = dealsSummary.deals.reduce(
  //     (acc, [amount, price]) => {
  //       acc += Number(price) * (amount / dealsSummary.amount);
  //       return acc;
  //     },
  //     0,
  //   );

  //   const position = await this.prisma.position.findFirst({
  //     where: {
  //       exchange: Exchange.MOEX,
  //       securityType: SecurityType.BOND,
  //       portfolioId,
  //       securityId,
  //     },
  //   });

  //   if (!position) {
  //     this.prisma.position.create({
  //       data: {
  //         amount: dealsSummary.amount,
  //         averagePrice: dealsSummary.averagePrice,
  //         exchange: Exchange.MOEX,
  //         portfolioId: portfolioId,
  //         securityId: securityId,
  //         securityType: SecurityType.BOND,
  //         tradeSaldo: dealsSummary.tradeSaldo,
  //       },
  //     });
  //   } else {
  //     this.prisma.position.update({
  //       where: {
  //         id: position.id,
  //       },
  //       data: {
  //         amount: dealsSummary.amount,
  //         averagePrice: dealsSummary.averagePrice,
  //         tradeSaldo: dealsSummary.tradeSaldo,
  //       },
  //     });
  //   }
  // }

  async addCurrentPricesToPositions(
    positions: Position[],
  ): Promise<Position[]> {
    const dbBonds = await this.prisma.moexBond.findMany({
      where: { id: { in: positions.map(p => p.securityId) } },
    });

    for (const position of positions) {
      const bond = dbBonds.find(v => v.id === position.securityId);
      if (!bond) continue;
      position.security = new MoexBond(bond);
    }

    const bondPrices = await this.moexApi.getStocksCurrentPrices(
      MoexMarket.bonds,
      positions.map(p => p.security!.ticker).join(','),
    );

    for (const p of positions) {
      const currentPrice = bondPrices.securities.data.find(
        priceData =>
          priceData[0] === p.security!.ticker &&
          priceData[1] === p.security!.board,
      )![2];
      p.currentPrice = currentPrice;
      p.total = currentPrice * p.amount;
    }

    return positions;
  }
}
