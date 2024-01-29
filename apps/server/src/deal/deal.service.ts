import { Injectable } from '@nestjs/common';
import { DealRepository } from './deal.repository';
import { MoexShareService } from 'src/moex/shares/share.service';
import { MoexBondService } from 'src/moex/bonds/bond.service';
import { Deal } from './deal.model';
import { PositionService } from 'src/position/position.service';
import { Security } from 'src/types';

@Injectable()
export class DealService {
  constructor(
    private dealRepository: DealRepository,
    private moexShareService: MoexShareService,
    private moexBondService: MoexBondService,
    private positionService: PositionService,
  ) {}

  async create(ticker: string, dealModel: Deal) {
    // check by exchange property from which table u get security
    // for now it's always moex
    // get the security model
    let security: Security | null = null;

    if (dealModel.isShare()) {
      security = await this.moexShareService.getInfoByTicker(ticker);
    } else if (dealModel.isBond()) {
      security = await this.moexBondService.getByTicker(ticker);
    }

    // create security if was not found by ticker
    // if (!security) {
    //   const dataFromMoex: IMoexApiResponseSecurityInfo =
    //     await this.moexApi.getSecurityByTicker(ticker);

    //   const name = dataFromMoex.description.data.find(
    //     arr => arr[0] === 'NAME',
    //   )?.[2];
    //   const shortName = dataFromMoex.description.data.find(
    //     arr => arr[0] === 'SHORTNAME',
    //   )?.[2];
    //   const boardData = dataFromMoex.boards.data.find(i => i[4] === 1);
    //   const engine = boardData?.[3];
    //   const market = boardData?.[2];
    //   const board = boardData?.[1];

    //   if (
    //     [name, shortName, boardData, board, market, engine].find(
    //       i => i === undefined,
    //     )
    //   ) {
    //     throw new ImATeapotException(
    //       `[${DealService.name}]: Проблема с данными полученными в московской бирже`,
    //     );
    //   }

    //   if (dealModel.isShare()) {
    //     security = await this.moexShareService.create({
    //       board,
    //       engine,
    //       market,
    //       name,
    //       shortName,
    //       ticker,
    //     });
    //   } else if (dealModel.isBond()) {
    //     security = await this.moexBondService.create({
    //       board,
    //       engine,
    //       market,
    //       name,
    //       shortName,
    //       ticker,
    //     });
    //   }
    // }

    security && dealModel.setSecurityId(security.id);

    const deal = await this.dealRepository.create(dealModel.forPrismaCreate());

    await this.positionService.calculatePositionAfterDeal(dealModel);

    return deal;
  }

  async delete(id: number): Promise<Deal> {
    const deal = await this.dealRepository.deleteById(id);
    return deal;
  }
}
