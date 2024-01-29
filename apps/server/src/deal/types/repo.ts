import { DealType, Exchange, SecurityType } from 'contracts';
import { Prisma } from 'database';

// Feed them to Prisma
export type DealPrismaCreateData = {
  amount: number;
  date: Date;
  exchange: Exchange;
  portfolioId: number;
  price: number;
  securityType: SecurityType;
  securityId: number;
  ticker: string;
  type: DealType;
};

export type DealPrismaUpdateData = Partial<DealPrismaCreateData> &
  Record<'id', number>;

//Types returned from Prisma Repo
const prismaDeal = Prisma.validator<Prisma.DealDefaultArgs>()({});
export type PrismaDeal = Prisma.DealGetPayload<typeof prismaDeal>;

const dealWithRelations = Prisma.validator<Prisma.DealDefaultArgs>()({
  include: { portfolio: true },
});
export type PrismaDealWithRelations = Prisma.DealGetPayload<
  typeof dealWithRelations
>;
