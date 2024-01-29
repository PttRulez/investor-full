import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  async cleandDb() {
    return this.$transaction([
      this.transaction.deleteMany(),
      this.deal.deleteMany(),
      this.portfolio.deleteMany(),
      this.moexBond.deleteMany(),
      this.moexShare.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
