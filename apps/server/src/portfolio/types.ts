import { Prisma } from 'database';
import { MoexPositions } from 'src/position/moexpositions';

export type PrismaCreatePortfolioData = {
  userId: number;
  name: string;
  compound: boolean;
};

export type PrismaUpdatePortfolioData = Partial<PrismaCreatePortfolioData>;

//Types returned from Prisma Repo
const prismaPortfolio = Prisma.validator<Prisma.PortfolioDefaultArgs>()({});
export type PrismaPortfolio = Prisma.PortfolioGetPayload<
  typeof prismaPortfolio
>;

const portfolioWithRelations = Prisma.validator<Prisma.PortfolioDefaultArgs>()({
  include: { transactions: true, deals: true },
});

export type PortfolioWithRelations = Prisma.PortfolioGetPayload<
  typeof portfolioWithRelations
>;

export type PortfolioPositions = MoexPositions;
