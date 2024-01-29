import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DealPrismaCreateData, DealPrismaUpdateData } from './types/repo';
import { Deal } from './deal.model';

@Injectable()
export class DealRepository {
  constructor(private prisma: PrismaService) {}

  async create(dealData: DealPrismaCreateData): Promise<Deal> {
    const newDealFromDb = await this.prisma.deal.create({
      data: dealData,
      include: {
        portfolio: true,
      },
    });

    return new Deal(newDealFromDb);
  }

  async update(dealData: DealPrismaUpdateData): Promise<Deal> {
    const { id, ...withoudId } = dealData;
    const newDealFromDb = await this.prisma.deal.update({
      where: { id },
      data: { ...withoudId },
      include: {
        portfolio: true,
      },
    });

    return new Deal(newDealFromDb);
  }

  async deleteById(dealId: number): Promise<Deal> {
    const deleted = await this.prisma.deal.delete({
      where: {
        id: dealId,
      },
    });

    return new Deal(deleted);
  }
}
