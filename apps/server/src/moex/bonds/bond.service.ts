import { ImATeapotException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IMoexApiResponseSecurityInfo, MoexRepoCreateBond } from '../types';
import { MoexBond } from './bond.model';
import { MoexApi } from '../iss-api/moex-api.service';

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

  async getByTicker(ticker: string): Promise<MoexBond | null> {
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
}
