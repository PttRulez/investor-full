import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PortfolioRepository } from './portfolio.repository';
import { DealType, TransactionType } from 'contracts';
import { PrismaCreatePortfolioData, PrismaUpdatePortfolioData } from './types';
import { Portfolio } from './portfolio.model';
import { PositionService } from 'src/position/position.service';

@Injectable()
export class PortfolioService {
  constructor(
    private portfolioRepository: PortfolioRepository,
    private positionService: PositionService,
  ) {}

  create(portfolioData: PrismaCreatePortfolioData): Promise<Portfolio> {
    return this.portfolioRepository.create(portfolioData);
  }

  getAllUserPortfolios(userId: number): Promise<Portfolio[]> {
    return this.portfolioRepository.getAllUserPortfolios(userId);
  }

  async getOneById(userId: number, portfolioId: number): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne(portfolioId);

    if (!portfolio)
      throw new NotFoundException("Portfolio with this id doesn't exist");

    if (!portfolio.belongsToUser(userId))
      throw new UnauthorizedException('Not your portfolio :(');
    return portfolio;
    // return portfolio.toJSON(this.positionService);
  }

  async update(
    currentUserId: number,
    portfolioId: number,
    portfolioData: PrismaUpdatePortfolioData,
  ) {
    const foundPortfolio = await this.portfolioRepository.findOne(portfolioId);
    if (!foundPortfolio)
      throw new NotFoundException("Portfolio with this id doesn't exist");

    if (!foundPortfolio.belongsToUser(currentUserId))
      throw new UnauthorizedException('Not your portfolio :(');

    return this.portfolioRepository.update(portfolioId, portfolioData);
  }

  async remove(currentUserId: number, portfolioId: number) {
    const foundPortfolio = await this.portfolioRepository.findOne(portfolioId);
    if (!foundPortfolio)
      throw new NotFoundException("Portfolio with this id doesn't exist");

    if (!foundPortfolio.belongsToUser(currentUserId))
      throw new UnauthorizedException('Not your portfolio :(');

    return this.portfolioRepository.remove(portfolioId);
  }

  async calculateProfitability(portfolio: Portfolio): Promise<{
    totalProfitLoss: number;
    roi: number;
    averageYearlyProfitability: number;
  }> {
    const dealProfitLoss = portfolio.deals.map(deal => {
      if (deal.type === DealType.BUY) {
        return deal.amount * deal.price * -1; // Cost
      } else {
        return deal.amount * deal.price; // Revenue
      }
    });

    const totalCashFlows = portfolio.transactions.reduce(
      (total, transaction) => {
        if (transaction.type === TransactionType.CASHOUT) {
          return total - transaction.amount;
        } else {
          return total + transaction.amount;
        }
      },
      0,
    );

    const totalDividends = 0;

    const { bondPositions, sharePositions } =
      await this.positionService.hydratePositionsForPortfolio(
        portfolio.positions,
      );
    const positions = bondPositions.concat(sharePositions);
    const remainingSharesValue = positions.reduce(
      (total, position) => total + position.amount * position.currentPrice,
      0,
    );

    const totalProfitLoss =
      dealProfitLoss.reduce((total, profitLoss) => total + profitLoss, 0) +
      totalDividends +
      remainingSharesValue;

    const initialInvestment = Math.abs(totalCashFlows) + remainingSharesValue;
    const roi = (totalProfitLoss / initialInvestment) * 100;

    const numYears = 1; // Number of years
    const averageYearlyProfitability = totalProfitLoss / numYears;

    return { totalProfitLoss, roi, averageYearlyProfitability };
  }
}
