import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { MoexBondService } from './bond.service';
import { IMoexSecurtiyResponse } from 'contracts';
import { Response } from 'express';

@Controller('moex/bonds')
export class BondsController {
  constructor(private moexBondService: MoexBondService) {}

  @Get(':ticker')
  async getBondMoexInfoByTicker(
    @Res() res: Response,
    @Param('ticker') ticker: string,
  ): Promise<IMoexSecurtiyResponse | void> {
    const bond = await this.moexBondService.getByTicker(ticker);
    if (bond) {
      return bond.toJSON();
    } else {
      res.status(HttpStatus.NOT_FOUND).send();
    }
  }
}
