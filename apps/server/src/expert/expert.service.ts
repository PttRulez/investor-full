import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaExpert } from './types';
import { Expert } from './expert.model';
import { UpdateExpertDto } from './expert.dto';

@Injectable()
export class ExpertService {
  constructor(private prisma: PrismaService) {}

  async create(
    name: string,
    userId: number,
    avatarUrl?: string,
  ): Promise<Expert> {
    const newExpertFromDb: PrismaExpert = await this.prisma.expert.create({
      data: {
        avatarUrl: avatarUrl ?? null,
        name,
        userId,
      },
    });
    return new Expert(newExpertFromDb);
  }

  async delete(expertId: number): Promise<boolean> {
    const deleted = this.prisma.expert.delete({
      where: { id: expertId },
    });

    return Boolean(deleted);
  }

  async getExpertsList(): Promise<Expert[]> {
    const experts = await this.prisma.expert.findMany();
    return experts.map(e => new Expert(e));
  }

  async getExpertWithOpinions(expertId: number): Promise<Expert | null> {
    const expert = await this.prisma.expert.findUnique({
      where: { id: expertId },
      include: { opinions: true },
    });
    return expert ? new Expert(expert) : null;
  }

  async update(
    expertId: number,
    expertData: Omit<UpdateExpertDto, 'id'>,
  ): Promise<Expert> {
    const updatedExpert = await this.prisma.expert.update({
      where: { id: expertId },
      data: {
        ...expertData,
      },
    });

    return new Expert(updatedExpert);
  }
}
