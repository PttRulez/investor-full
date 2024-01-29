import { Prisma } from 'database';

const prismaExpert = Prisma.validator<Prisma.ExpertDefaultArgs>()({});
export type PrismaExpert = Prisma.ExpertGetPayload<typeof prismaExpert>;

const expertWithRelations = Prisma.validator<Prisma.ExpertDefaultArgs>()({
  include: { opinions: true },
});
export type PrismaExpertWithRelations = Prisma.ExpertGetPayload<
  typeof expertWithRelations
>;
