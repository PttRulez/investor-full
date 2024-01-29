import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { PortfolioRepository } from './portfolio.repository';
import { MoexModule } from 'src/moex/moex.module';
import { PositionModule } from 'src/position/position.module';
import { PositionService } from 'src/position/position.service';
import { MoexApi } from 'src/moex/iss-api/moex-api.service';

@Module({
  imports: [MoexModule, PositionModule],
  controllers: [PortfolioController],
  providers: [PortfolioService, PortfolioRepository, PositionService, MoexApi],
})
export class PortfolioModule {}
