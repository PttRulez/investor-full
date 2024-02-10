import { Exchange } from 'contracts';
import { Prisma } from 'database';

export type PrismaCreatePositionData = {
  amount: number;
  averagePrice: number;
  exchange: Exchange;
  portfolioId: number;
  securityId: number;
  securityType: string;
  tradeSaldo: number;
  comment?: string;
  targetPrice?: number;
  ticker: string;
};

export type PositionUpdateData = Partial<PrismaCreatePositionData> &
  Record<'id', number>;

//Types returned from Prisma Repo
const prismaPosition = Prisma.validator<Prisma.PositionDefaultArgs>()({});
export type PrismaPosition = Prisma.PositionGetPayload<typeof prismaPosition>;

const positionWithRelations = Prisma.validator<Prisma.PositionDefaultArgs>()({
  include: { portfolio: true, opinions: true },
});
export type PrismaPositionWithRelations = Prisma.PositionGetPayload<
  typeof positionWithRelations
>;
