import { Module } from '@nestjs/common';
import { MoexApi } from './iss-api/moex-api.service';
import { MoexBondService } from './bonds/bond.service';
import { MoexShareService } from './shares/share.service';
import { BondsController } from './bonds/bonds.controller';
import { SharesController } from './shares/shares.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [MoexApi, MoexBondService, MoexShareService, PrismaService],
  exports: [MoexBondService, MoexShareService],
  controllers: [BondsController, SharesController],
})
export class MoexModule {}
