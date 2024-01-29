import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import {
  IMoexApiResponseCurrentPrices,
  IMoexApiResponseSecurityInfo,
} from '../types';
import { MoexBoard, MoexMarket } from 'contracts';

@Injectable()
export class MoexApi {
  private baseUrl = 'https://iss.moex.com/iss';
  private readonly logger = new Logger(MoexApi.name);

  constructor(private http: HttpService) {
    http.axiosRef.interceptors.request.use(
      req => {
        return req;
      },
      err => {
        console.log('[MoexApi axios request ERROR]: ', err);
      },
    );

    http.axiosRef.interceptors.response.use(
      res => {
        return res;
      },
      err => {
        console.log('[MoexApi axios response ERROR]: ', err);
      },
    );
  }

  async getSecurityByTicker(
    ticker: string,
  ): Promise<IMoexApiResponseSecurityInfo> {
    const moexSecurityUrl = `${this.baseUrl}/securities/${ticker}.json`;

    const { data } = await firstValueFrom(
      this.http.get<IMoexApiResponseSecurityInfo>(moexSecurityUrl, {
        params: {
          'iss.meta': 'off',
          // 'description.columns': 'ssecid,name,shortname,type',
          'boards.columns': 'secid,boardid,market,engine,is_primary',
        },
      }),
    );

    return data;
  }

  async getStocksCurrentPrices(
    market: MoexMarket,
    tickers: string,
  ): Promise<IMoexApiResponseCurrentPrices | void> {
    //: Promise<IMoexApiResponseCurrentPrices> {
    try {
      const response = await firstValueFrom(
        this.http
          .get<IMoexApiResponseCurrentPrices>(
            `${this.baseUrl}/engines/stock/markets/${market}/securities.json`,
            {
              params: {
                'iss.meta': 'off',
                securities: tickers,
                ['securities.columns']: 'SECID,BOARDID,PREVPRICE',
              },
            },
          )
          .pipe(
            catchError(() => {
              throw 'An error happened!';
            }),
          ),
      );

      if (!response) {
        return {
          securities: { data: [['her', MoexBoard.TQBR, 1]] },
        };
      } else {
        return response.data;
      }
    } catch (e) {
      console.log('[Moex-Api.Service.getStocksCurrentPrices ERROR]:', e);
    }
  }

  // async getCurrencyCurrentPrices(
  //   market: MoexMarket,
  //   tickers: string,
  // ): Promise<IMoexApiResponseCurrentPrices> {
  //   //: Promise<IMoexApiResponseCurrentPrices> {
  //   try {
  //     const response = await firstValueFrom(
  //       this.http
  //         .get<IMoexApiResponseCurrentPrices>(
  //           `${this.baseUrl}/engines/currency/markets/${market}/securities.json`,
  //           {
  //             params: {
  //               'iss.meta': 'off',
  //               securities: tickers,
  //               ['securities.columns']: 'SECID,BOARDID,PREVPRICE', // PREVWAPRICE ?
  //             },
  //           },
  //         )
  //         .pipe(
  //           catchError((error: AxiosError) => {
  //             console.log(error.response.data);
  //             throw 'An error happened!';
  //           }),
  //         ),
  //     );

  //     if (!response) {
  //       return {
  //         securities: { data: [['her', MoexBoard.TQBR, 1]] },
  //       };
  //     } else {
  //       return response.data;
  //     }
  //   } catch (e) {
  //     console.log('[Moex-Api.Service.getStocksCurrentPrices ERROR]:', e);
  //   }
  // }
}
