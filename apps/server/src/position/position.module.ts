import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { MoexShareService } from 'src/moex/shares/share.service';
import { MoexApi } from 'src/moex/iss-api/moex-api.service';
import { PositionController } from './position.controller';
import { OpinionService } from 'src/opinion/opinion.service';
import { OpinionModule } from 'src/opinion/opinion.module';
import { MoexBondService } from 'src/moex/bonds/bond.service';

@Module({
  imports: [OpinionModule],
  controllers: [PositionController],
  providers: [
    OpinionService,
    PositionService,
    MoexBondService,
    MoexShareService,
    MoexApi,
  ],
})
export class PositionModule {}
