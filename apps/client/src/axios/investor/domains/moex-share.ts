import { AxiosInstance } from 'axios';
import { IMoexShareResponse } from 'contracts';

export class InvestorMoexShare {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  getByTicker(ticker: string): Promise<IMoexShareResponse> {
    return this.api
      .get(`/moex/shares/${ticker}`)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log('[investorApi.InvestorMoexShare.getByTicker ERR]:', err);
      });
  }
}
