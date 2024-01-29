import { ImATeapotException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IMoexApiResponseSecurityInfo, MoexRepoCreateShare } from '../types';
import { MoexShare } from './share.model';
import { MoexApi } from '../iss-api/moex-api.service';

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

  async getInfoByTicker(ticker: string): Promise<MoexShare | null> {
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
}
