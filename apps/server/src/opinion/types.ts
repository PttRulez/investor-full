import { Prisma } from 'database';

const prismaOpinion = Prisma.validator<Prisma.OpinionDefaultArgs>()({});
export type PrismaOpinion = Prisma.OpinionGetPayload<typeof prismaOpinion>;

const opinionWithRelations = Prisma.validator<Prisma.OpinionDefaultArgs>()({
  include: { createdBy: true, expert: true },
});
export type PrismaOpinionWithRelations = Prisma.OpinionGetPayload<
  typeof opinionWithRelations
>;
