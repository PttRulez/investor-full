import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { GetUserId } from '../auth/decorators';
import { IPortfolioResponse, IPortfolioListResponse } from 'contracts';
import { CreatePortfolioDto, UpdatePortfolioDto } from './portfolio.dto';
import { PositionService } from 'src/position/position.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private positionService: PositionService,
  ) {}

  @Get()
  async getAllUserPortfolios(
    @GetUserId() userId: number,
  ): Promise<IPortfolioListResponse[]> {
    const portfolios = await this.portfolioService.getAllUserPortfolios(userId);
    return portfolios.map(p => p.toListJSON());
  }

  @Get(':id')
  async getOneById(
    @GetUserId() userId: number,
    @Param('id') id: string,
  ): Promise<
    IPortfolioResponse & {
      results: {
        totalProfitLoss: number;
        roi: number;
        averageYearlyProfitability: number;
      };
    }
  > {
    const portfolio = await this.portfolioService.getOneById(
      userId,
      Number(id),
    );
    const results =
      await this.portfolioService.calculateProfitability(portfolio);
    console.log('results', results);
    const json = await portfolio.toJSON(this.positionService);
    return { ...json, results };
  }

  @Post()
  async create(
    @GetUserId() userId: number,
    @Body() dto: CreatePortfolioDto,
  ): Promise<Record<string, any>> {
    const portfolioModel = await this.portfolioService.create({
      ...dto,
      userId,
    });
    return portfolioModel.toJSON(this.positionService);
  }

  @Patch(':id')
  async update(
    @GetUserId() userId: number,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @Param('id') portfolioId: string,
  ): Promise<Record<string, any>> {
    const portfolioModel = await this.portfolioService.update(
      userId,
      parseInt(portfolioId),
      updatePortfolioDto,
    );
    return portfolioModel.toJSON(this.positionService);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(
    @GetUserId() userId: number,
    @Param('id') portfolioId: string,
  ): Promise<IPortfolioResponse> {
    const portfolioModel = await this.portfolioService.remove(
      userId,
      Number(portfolioId),
    );
    return portfolioModel.toJSON(this.positionService);
  }
}
