import { AxiosInstance } from 'axios';
import { IMoexBondResponse } from 'contracts';

export class InvestorMoexBond {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  getByTicker(ticker: string): Promise<IMoexBondResponse> {
    return this.api
      .get(`/moex/bonds/${ticker}`)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log('[investorApi.InvestorMoexBond.getByTicker ERR]:', err);
      });
  }
}
