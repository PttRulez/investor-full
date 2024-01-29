import { MoexMarket, SecurityType } from 'contracts';

export const moexMarketToSecType = (market: MoexMarket): SecurityType => {
  if (market === MoexMarket.shares) {
    return SecurityType.SHARE;
  } else {
    return SecurityType.BOND;
  }
};
