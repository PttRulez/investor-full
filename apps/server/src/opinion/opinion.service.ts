import { OpinionFilters } from 'contracts';
import { Injectable } from '@nestjs/common';
import { Opinion } from './opinion.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOpinionDto, UpdateOpinionDto } from './opinion.dto';

@Injectable()
export class OpinionService {
  constructor(private prisma: PrismaService) {}

  async createOpinion(
    opininonData: CreateOpinionDto & { userId: number },
  ): Promise<Opinion> {
    const opinion = await this.prisma.opinion.create({
      data: {
        ...opininonData,
        // targetPrice: new Prisma.Decimal(opininonData.targetPrice),
      },
    });
    return new Opinion(opinion);
  }

  async getOpinionsList(filters: OpinionFilters & { userId?: number } = {}) {
    const opinions = await this.prisma.opinion.findMany({
      where: { ...filters },
      include: {
        expert: true,
      },
    });
    return opinions.map(o => new Opinion(o));
  }

  async updateOpinion(opininonData: UpdateOpinionDto): Promise<Opinion> {
    const { id, ...dataToPatch } = opininonData;
    const opinion = await this.prisma.opinion.update({
      where: { id },
      data: {
        ...dataToPatch,
      },
    });
    return new Opinion(opinion);
  }
}
