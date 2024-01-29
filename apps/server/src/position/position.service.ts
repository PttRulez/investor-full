import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaCreatePositionData, PrismaPosition } from './types';
import { MoexShareService } from 'src/moex/shares/share.service';
import { Deal } from 'src/deal/deal.model';
import { DealType } from 'contracts';

@Injectable()
export class PositionService {
  constructor(
    private moexShareService: MoexShareService,
    private prisma: PrismaService,
  ) {}

  async createOne(data: PrismaCreatePositionData): Promise<PrismaPosition> {
    const position = await this.prisma.position.create({
      data,
    });
    return position;
  }

  async calculatePositionAfterDeal(deal: Deal): Promise<void> {
    const position = await this.prisma.position.findFirst({
      where: {
        exchange: deal.exchange,
        portfolioId: deal.portfolioId,
        securityType: deal.securityType,
        securityId: deal.securityId,
      },
    });

    const deals = await this.prisma.deal.findMany({
      where: {
        exchange: deal.exchange,
        portfolioId: deal.portfolioId,
        securityType: deal.securityType,
        securityId: deal.securityId,
      },
    });

    const dealsSummary = deals.reduce(
      (acc, deal) => {
        acc.tradeSaldo +=
          (deal.type === DealType.SELL ? deal.amount : -deal.amount) *
          Number(deal.price);
        acc.amount += deal.type === DealType.BUY ? deal.amount : -deal.amount;
        acc.deals.push([deal.amount, deal.price]);
        return acc;
      },
      {
        amount: 0,
        averagePrice: 0,
        deals: [] as [number, number][],
        tradeSaldo: 0,
      },
    );

    dealsSummary.averagePrice = dealsSummary.deals.reduce(
      (acc, [amount, price]) => {
        acc += Number(price) * (amount / dealsSummary.amount);
        return acc;
      },
      0,
    );

    if (!position) {
      this.prisma.position.create({
        data: {
          amount: deal.amount,
          averagePrice: dealsSummary.averagePrice,
          exchange: deal.exchange,
          portfolioId: deal.portfolioId,
          securityId: deal.securityId,
          securityType: deal.securityType,
          tradeSaldo: dealsSummary.tradeSaldo,
        },
      });
    } else {
      this.prisma.position.update({
        where: {
          id: position.id,
        },
        data: {
          amount: dealsSummary.amount,
          averagePrice: dealsSummary.averagePrice,
          tradeSaldo: dealsSummary.tradeSaldo,
        },
      });
    }
  }
}
