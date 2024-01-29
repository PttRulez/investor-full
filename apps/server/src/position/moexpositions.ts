import {
  DealType,
  Exchange,
  IPortfolioPositionsResponse,
  IPositionResponse,
  MoexMarket,
} from 'contracts';
import { Deal } from 'src/deal/deal.model';
import { MoexApi } from '../moex/iss-api/moex-api.service';
import { MoexBondService } from '../moex/bonds/bond.service';
import { MoexShareService } from '../moex/shares/share.service';

export class MoexPositions {
  bonds: Array<IPositionResponse> = [];
  bondDeals: Deal[];
  bondsTotal: number = 0;
  private moexApi: MoexApi;
  private moexBondsService: MoexBondService;
  private moexSharesService: MoexShareService;
  shares: Array<IPositionResponse> = [];
  shareDeals: Deal[];
  sharesTotal: number = 0;

  constructor(
    moexDeals: { bonds: Deal[]; shares: Deal[] },
    moexApi: MoexApi,
    moexBondsService: MoexBondService,
    moexSharesService: MoexShareService,
  ) {
    this.bondDeals = moexDeals.bonds;
    this.shareDeals = moexDeals.shares;
    this.moexApi = moexApi;
    this.moexBondsService = moexBondsService;
    this.moexSharesService = moexSharesService;
  }

  async calculatePositions() {
    await this.calculateBondsPositions();
    await this.calculateSharesPositions();
  }

  async calculateBondsPositions(): Promise<void> {
    if (this.bondDeals.length === 0) return;

    // receiving bond prices from ISS MOEX API
    const bondTickersString: string = this.bondDeals
      .map(d => d.ticker)
      .join(',');

    const bondPrices = await this.moexApi.getStocksCurrentPrices(
      MoexMarket.bonds,
      bondTickersString,
    );

    if (!bondPrices) {
      this.bonds = [];
      this.bondsTotal = 0;
      return;
    }

    // receiving bonds models from repo by securityIds from deals
    const bondIdsArray = Array.from(
      new Set(this.bondDeals.map(d => d.securityId)),
    );
    const moexBondModels = await this.moexBondsService.getBulk(bondIdsArray);

    const bonds: Record<string, IPositionResponse> = {};

    // calculating amount of securities for each position
    this.bondDeals.forEach(d => {
      if (!bonds[d.ticker]) {
        bonds[d.ticker] = { amount: 0 } as IPositionResponse;
      }
      bonds[d.ticker].amount += d.type === DealType.BUY ? d.amount : -d.amount;
    });

    // adding currentPrices to positions
    moexBondModels.forEach(bond => {
      const { amount, tradeSaldo } = bonds[bond.ticker];

      const currentPrice = bondPrices.securities.data.find(
        priceData =>
          priceData[0] === bond.ticker && priceData[1] === bond.board,
      )![2];

      bonds[bond.ticker].currentPrice = currentPrice;
      const total = currentPrice * amount;

      bonds[bond.ticker] = {
        amount,
        currentPrice,
        total,
        tradeSaldo,
        security: { ...bond.toJSON(), exchange: Exchange.MOEX },
      };
    });

    this.bonds = Object.values(bonds);
    this.bondsTotal = this.bonds.reduce<number>(
      (acc: number, p: IPositionResponse) => acc + p.total,
      0,
    );
  }

  async calculateSharesPositions(): Promise<void> {
    if (this.shareDeals.length === 0) return;

    // receiving share prices from ISS MOEX API
    const shareTickersString: string = this.shareDeals
      .map(d => d.ticker)
      .join(',');
    const sharePrices = await this.moexApi.getStocksCurrentPrices(
      MoexMarket.shares,
      shareTickersString,
    );

    if (!sharePrices) {
      this.shares = [];
      this.sharesTotal = 0;
      return;
    }

    // receiving bonds models from repo by securityIds from deals
    const shareIdsArray = Array.from(
      new Set(this.shareDeals.map(d => d.securityId)),
    );
    const moexShareModels = await this.moexSharesService.getBulk(shareIdsArray);

    const shares: Record<string, IPositionResponse> = {};

    this.shareDeals.forEach(d => {
      if (!shares[d.ticker]) {
        shares[d.ticker] = { amount: 0, tradeSaldo: 0 } as IPositionResponse;
      }
      shares[d.ticker].amount += d.type === DealType.BUY ? d.amount : -d.amount;
      shares[d.ticker].tradeSaldo +=
        (d.type === DealType.SELL ? d.amount : -d.amount) * d.price;
    });

    moexShareModels.forEach(share => {
      const { amount, tradeSaldo } = shares[share.ticker];
      const currentPrice = (shares[share.ticker].currentPrice =
        sharePrices.securities.data.find(
          priceData =>
            priceData[0] === share.ticker && priceData[1] === share.board,
        )![2]);
      const total = currentPrice * amount;

      shares[share.ticker] = {
        amount,
        currentPrice,
        total,
        tradeSaldo,
        security: { ...share.toJSON(), exchange: Exchange.MOEX },
      };
    });

    this.shares = Object.values(shares);
    this.sharesTotal = this.shares.reduce<number>(
      (acc: number, p: IPositionResponse) => acc + p.total,
      0,
    );
  }

  toJSON(): IPortfolioPositionsResponse {
    const allPositions = this.bonds.concat(this.shares);

    // const tradeSaldo = allPositions.reduce(
    //   (total, cur) => total + cur.tradeSaldo,
    //   0,
    // );

    return {
      allPositions,
      bondPositions: this.bonds,
      bondsTotal: this.bondsTotal,
      sharePositions: this.shares,
      sharesTotal: this.sharesTotal,
      // tradeSaldo,
    };
  }
}
