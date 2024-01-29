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
};

export type DealPositionUpdateData = Partial<PrismaCreatePositionData> &
  Record<'id', number>;

//Types returned from Prisma Repo
const prismaPosition = Prisma.validator<Prisma.DealDefaultArgs>()({});
export type PrismaPosition = Prisma.PositionGetPayload<typeof prismaPosition>;

const dealWithRelations = Prisma.validator<Prisma.DealDefaultArgs>()({
  include: { portfolio: true },
});
export type PrismaPositionWithRelations = Prisma.PositionGetPayload<
  typeof dealWithRelations
>;
