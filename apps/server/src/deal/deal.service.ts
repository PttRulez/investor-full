import { Injectable } from '@nestjs/common';
import { DealRepository } from './deal.repository';
import { MoexShareService } from 'src/moex/shares/share.service';
import { MoexBondService } from 'src/moex/bonds/bond.service';
import { PositionService } from 'src/position/position.service';
import { Security } from 'src/types';
import { SecurityType } from 'contracts';
import { Deal } from './deal.model';

@Injectable()
export class DealService {
  constructor(
    private dealRepository: DealRepository,
    private moexShareService: MoexShareService,
    private moexBondService: MoexBondService,
    private positionService: PositionService,
  ) {}

  async create(ticker: string, deal: Deal) {
    let security: Security;
    if (deal.securityType == SecurityType.SHARE) {
      security = await this.moexShareService.getInfoByTicker(ticker);
    } else {
      security = await this.moexBondService.getByTicker(ticker);
    }

    await this.dealRepository.create({
      ...deal,
      securityId: security.id,
    });

    await this.positionService.upsertPosition({
      exchange: deal.exchange,
      portfolioId: deal.portfolioId,
      securityId: security.id,
      securityType: deal.securityType,
    });

    return deal;
  }

  async delete(id: number): Promise<void> {
    await this.dealRepository.deleteById(id);
  }
}
