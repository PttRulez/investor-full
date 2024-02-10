import {
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IMoexApiResponseSecurityInfo, MoexRepoCreateShare } from '../types';
import { MoexShare } from './share.model';
import { MoexApi } from '../iss-api/moex-api.service';
import { Position } from 'src/position/position.model';
import { MoexMarket } from 'contracts';

@Injectable()
export class MoexShareService {
  constructor(
    private prisma: PrismaService,
    private moexApi: MoexApi,
  ) {}

  async create(securityData: MoexRepoCreateShare): Promise<MoexShare> {
    const dbSecurity = await this.prisma.moexShare.create({
      data: securityData,
    });

    return new MoexShare(dbSecurity);
  }

  async createByTicker(ticker: string): Promise<MoexShare> {
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
        `[${MoexShareService.name}]: Проблема с данными полученными в московской бирже`,
      );
    }

    const share = await this.create({
      board,
      engine,
      market,
      name,
      shortName,
      ticker,
    } as MoexRepoCreateShare);

    return share;
  }

  async getInfoByTicker(ticker: string): Promise<MoexShare> {
    const share = await this.prisma.moexShare.findUnique({
      where: {
        ticker,
      },
    });

    if (share) {
      return new MoexShare(share);
    } else {
      const share = await this.createByTicker(ticker);
      return share;
    }
  }

  async getBulk(ids: number[]): Promise<MoexShare[]> {
    const secs = await this.prisma.moexShare.findMany({
      where: { id: { in: ids } },
    });

    return secs.map(s => new MoexShare(s));
  }

  async getOneById(id: number): Promise<MoexShare> {
    const share = await this.prisma.moexShare.findUnique({ where: { id } });
    if (!share) throw NotFoundException;
    return new MoexShare(share);
  }

  async addCurrentPricesToPositions(
    positions: Position[],
  ): Promise<Position[]> {
    const dbShares = await this.prisma.moexShare.findMany({
      where: { id: { in: positions.map(p => p.securityId) } },
    });

    for (const position of positions) {
      const share = dbShares.find(v => v.id === position.securityId);
      if (!share) continue;
      position.security = new MoexShare(share);
    }

    const sharePrices = await this.moexApi.getStocksCurrentPrices(
      MoexMarket.shares,
      positions.map(p => p.security!.ticker).join(','),
    );

    for (const p of positions) {
      const currentPrice = sharePrices.securities.data.find(
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
