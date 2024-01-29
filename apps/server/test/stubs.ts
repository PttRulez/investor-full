import {
  DealType,
  Exchange,
  SecurityType,
  TransactionType,
  CreateDealDto,
  CreateTransactionDto,
  CreatePortfolioDto,
  LoginDto,
  RegisterDto,
  UpdatePortfolioDto,
} from 'contracts';

export const firstUserStub = (): UserStub => ({
  loginDto: {
    email: 'vasilek@mail.ru',
    password: '123',
  },
  portfolios: [
    {
      id: null,
      createDto: {
        name: 'Альфа',
        compound: false,
      },
      updateDto: {
        name: 'Альфа updated',
      },
      cashouts: [
        {
          createDto: {
            amount: 100,
            date: new Date(
              new Date().setHours(
                new Date().getTimezoneOffset() / -60,
                0,
                0,
                0,
              ),
            ),
            type: TransactionType.CASHOUT,
          },
          id: null,
        },
      ],
      deposits: [
        {
          createDto: {
            amount: 1000,
            date: new Date(
              new Date().setHours(
                new Date().getTimezoneOffset() / -60,
                0,
                0,
                0,
              ),
            ),
            type: TransactionType.DEPOSIT,
          },
          id: null,
        },
      ],
      deals: [
        {
          createDto: {
            amount: 10,
            date: new Date(
              new Date().setHours(
                new Date().getTimezoneOffset() / -60,
                0,
                0,
                0,
              ),
            ),
            exchange: Exchange.MOEX,
            price: 221.5,
            securityType: SecurityType.SHARE,
            ticker: 'SBERP',
            type: DealType.BUY,
          },
          id: null,
        },
      ],
    },
    {
      id: null,
      createDto: {
        name: 'ВТБ',
        compound: false,
      },
      cashouts: [
        {
          createDto: {
            amount: 200,
            date: new Date(
              new Date().setHours(
                new Date().getTimezoneOffset() / -60,
                0,
                0,
                0,
              ),
            ),
            type: TransactionType.CASHOUT,
          },
          id: null,
        },
      ],
      deposits: [
        {
          createDto: {
            amount: 4000,
            date: new Date(
              new Date().setHours(
                new Date().getTimezoneOffset() / -60,
                0,
                0,
                0,
              ),
            ),
            type: TransactionType.DEPOSIT,
          },
          id: null,
        },
      ],
      deals: [
        {
          createDto: {
            amount: 20,
            date: new Date(
              new Date().setHours(
                new Date().getTimezoneOffset() / -60,
                0,
                0,
                0,
              ),
            ),
            exchange: Exchange.MOEX,
            price: 119.3,
            securityType: SecurityType.SHARE,
            ticker: 'FLOT',
            type: DealType.BUY,
          },
          id: null,
        },
      ],
    },
  ],
  registerDto: {
    email: 'vasilek@mail.ru',
    name: 'Vasya',
    password: '123',
  },
});

interface UserStub {
  loginDto: LoginDto;
  portfolios: {
    cashouts: {
      createDto: Omit<CreateTransactionDto, 'portfolioId'>;
      id: number | null;
    }[];
    createDto: CreatePortfolioDto;
    deals: {
      createDto: Omit<CreateDealDto, 'portfolioId'>;
      id: null | number;
    }[];
    deposits: {
      createDto: Omit<CreateTransactionDto, 'portfolioId'>;
      id: number | null;
    }[];
    id: null | number;
    updateDto?: UpdatePortfolioDto;
  }[];
  registerDto: RegisterDto;
}
