import { AxiosInstance, AxiosResponse } from 'axios';
import { LoginData, RegisterData, IUserResponse } from 'contracts';

export class InvestorAuth {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async login(dto: LoginData): Promise<AxiosResponse<IUserResponse, any>> {
    return this.api.post('/auth/login', { ...dto });
  }

  register(dto: RegisterData): Promise<AxiosResponse<IUserResponse, any>> {
    return this.api.post('/auth/register', { ...dto });
  }
}
