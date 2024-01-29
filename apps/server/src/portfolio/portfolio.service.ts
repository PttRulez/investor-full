import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PortfolioRepository } from './portfolio.repository';
import { Exchange, IPortfolioResponse, SecurityType } from 'contracts';
import { PrismaCreatePortfolioData, PrismaUpdatePortfolioData } from './types';
import { Portfolio } from './portfolio.model';
import { MoexPositions } from 'src/position/moexpositions';
import { Deal } from 'src/deal/deal.model';
import { MoexBondService } from 'src/moex/bonds/bond.service';
import { MoexShareService } from 'src/moex/shares/share.service';
import { MoexApi } from 'src/moex/iss-api/moex-api.service';

@Injectable()
export class PortfolioService {
  constructor(
    private portfolioRepository: PortfolioRepository,
    private readonly moexBondsService: MoexBondService,
    private moexSharesService: MoexShareService,
    private moexApi: MoexApi,
  ) {}

  create(portfolioData: PrismaCreatePortfolioData): Promise<Portfolio> {
    return this.portfolioRepository.create(portfolioData);
  }

  getAllUserPortfolios(userId: number): Promise<Portfolio[]> {
    return this.portfolioRepository.getAllUserPortfolios(userId);
  }

  async getOneById(
    userId: number,
    portfolioId: number,
  ): Promise<IPortfolioResponse> {
    const portfolio = await this.portfolioRepository.findOne(portfolioId);

    if (!portfolio)
      throw new NotFoundException("Portfolio with this id doesn't exist");

    if (!portfolio.belongsToUser(userId))
      throw new UnauthorizedException('Not your portfolio :(');

    const moexPositions = await this.getMoexPositions(portfolio);

    portfolio.loadPositions(moexPositions);

    return portfolio.toJSON();
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

  // ---------------- UTILS, CALCULATIONS etc. ----------------

  async getMoexPositions(model: Portfolio): Promise<MoexPositions> {
    //): Promise<{ positions: MoexPositions; total: number }> {
    // just resructuring Deal models in two arrays of bonds and shares
    const moexDeals: { bonds: Deal[]; shares: Deal[] } = model.deals
      .filter(d => d.exchange === Exchange.MOEX)
      .reduce(
        (acc: { bonds: Deal[]; shares: Deal[] }, deal: Deal) => {
          if (deal.securityType === SecurityType.BOND) {
            acc.bonds.push(deal);
          } else {
            acc.shares.push(deal);
          }
          return acc;
        },
        { bonds: [], shares: [] },
      );

    // empty result
    const positions: MoexPositions = new MoexPositions(
      moexDeals,
      this.moexApi,
      this.moexBondsService,
      this.moexSharesService,
    );
    await positions.calculatePositions();

    // const total = positions.bondsTotal + positions.sharesTotal;
    return positions;
  }
}
