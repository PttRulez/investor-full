import investorAxiosInstance from './config';
import { InvestorExpert } from './domains/expert';
import {
  InvestorAuth,
  InvestorDeal,
  InvestorMoexBond,
  InvestorMoexShare,
  InvestorOpinion,
  InvestorPortfolio,
  InvestorTransaction,
} from './domains/index';

class InvestorService {
  private static instance: InvestorService;
  private readonly investorApi = investorAxiosInstance;

  public auth: InvestorAuth;
  public deal: InvestorDeal;
  public expert: InvestorExpert;
  public opinion: InvestorOpinion;
  public portfolio: InvestorPortfolio;
  public moexBond: InvestorMoexBond;
  public moexShare: InvestorMoexShare;
  public transaction: InvestorTransaction;

  constructor() {
    this.auth = new InvestorAuth(this.investorApi);
    this.deal = new InvestorDeal(this.investorApi);
    this.expert = new InvestorExpert(this.investorApi);
    this.moexBond = new InvestorMoexBond(this.investorApi);
    this.moexShare = new InvestorMoexShare(this.investorApi);
    this.opinion = new InvestorOpinion(this.investorApi);
    this.portfolio = new InvestorPortfolio(this.investorApi);
    this.transaction = new InvestorTransaction(this.investorApi);
  }

  // Singleton
  public static get(): InvestorService {
    if (!InvestorService.instance) {
      InvestorService.instance = new InvestorService();
    }
    return InvestorService.instance;
  }
}

const investorService = InvestorService.get();

export default investorService;
