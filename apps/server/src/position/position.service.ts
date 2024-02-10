import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaCreatePositionData, PrismaPosition } from './types';
import {
  DealType,
  Exchange,
  IPositionResponse,
  SecurityType,
  UpdatePositionData,
} from 'contracts';
import { Position } from './position.model';
import { MoexBondService } from 'src/moex/bonds/bond.service';
import { MoexShareService } from 'src/moex/shares/share.service';

@Injectable()
export class PositionService {
  constructor(
    private moexBondService: MoexBondService,
    private moexShareService: MoexShareService,
    private prisma: PrismaService,
  ) {}

  async getOneById(id: number) {
    const dbData = await this.prisma.position.findUnique({
      where: { id },
    });
    if (!dbData) throw NotFoundException;

    return new Position(dbData);
  }

  async hydratePositionsForPortfolio(positions: Position[]): Promise<{
    bondPositions: IPositionResponse[];
    sharePositions: IPositionResponse[];
  }> {
    let bonds = positions.filter(p => p.securityType === SecurityType.BOND);
    let shares = positions.filter(p => p.securityType === SecurityType.SHARE);

    bonds = await this.moexBondService.addCurrentPricesToPositions(bonds);
    shares = await this.moexShareService.addCurrentPricesToPositions(shares);

    const bondPositions = bonds.map(p => p.toJSON());
    const sharePositions = shares.map(p => p.toJSON());

    return {
      bondPositions,
      sharePositions,
    };
  }

  async createOne(data: PrismaCreatePositionData): Promise<PrismaPosition> {
    const position = await this.prisma.position.create({
      data,
    });
    return position;
  }

  async updateOne(
    id: number,
    userId: number,
    data: UpdatePositionData,
  ): Promise<Position> {
    const position = await this.prisma.position.update({
      where: { id: id },
      data: {
        ...data,
        // opinions: {
        //   connect:
        //     data.opinions?.map(o => ({
        //       opinionId_positionId: {
        //         opinionId: o,
        //         positionId: id,
        //       },
        //     })) ?? [],
        // },
      },
    });
    return new Position(position);
  }

  async upsertPosition(data: {
    exchange: Exchange;
    portfolioId: number;
    securityId: number;
    securityType: SecurityType;
  }): Promise<void> {
    const position = await this.prisma.position.findFirst({
      where: {
        ...data,
      },
    });

    const deals = await this.prisma.deal.findMany({
      where: {
        ...data,
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
      await this.prisma.position.create({
        data: {
          amount: dealsSummary.amount,
          averagePrice: dealsSummary.averagePrice,
          exchange: data.exchange,
          portfolioId: data.portfolioId,
          securityId: data.securityId,
          securityType: data.securityType,
          tradeSaldo: dealsSummary.tradeSaldo,
        },
      });
    } else {
      await this.prisma.position.update({
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
