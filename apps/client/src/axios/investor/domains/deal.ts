import { CreateDealData, IDealResponse, UpdateDealData } from 'contracts';
import { AxiosInstance } from 'axios';

export class InvestorDeal {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async createDeal(data: CreateDealData): Promise<IDealResponse> {
    const res = await this.api.post<IDealResponse>('/deal', data);
    return res.data;
  }

  async deleteDeal(id: number): Promise<IDealResponse> {
    const res = await this.api.delete<IDealResponse>(`/deal/${id}`);
    return res.data;
  }

  updateDeal(data: UpdateDealData) {
    return this.api.post(`/deals/${data.id}`, data);
  }
}
