import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { MoexShareService } from 'src/moex/shares/share.service';
import { MoexApi } from 'src/moex/iss-api/moex-api.service';

@Module({
  providers: [PositionService, MoexShareService, MoexApi],
})
export class PositionModule {}
