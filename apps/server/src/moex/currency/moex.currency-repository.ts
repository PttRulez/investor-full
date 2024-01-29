import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MoexCurrency } from './moexcurrency.model';
import { MoexRepoCreateCurrency } from '../types';

@Injectable()
export class MoexBondRepository {
  constructor(private prisma: PrismaService) {}

  async create(securityData: MoexRepoCreateCurrency): Promise<MoexCurrency> {
    const dbSecurity = await this.prisma.moexBond.create({
      data: { ...securityData },
    });

    return new MoexCurrency(dbSecurity);
  }
}
