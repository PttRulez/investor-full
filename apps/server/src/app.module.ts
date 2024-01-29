import { Module } from '@nestjs/common';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { SessionGuard } from './auth/guards';
import { UserModule } from './user/user.module';
import { AdminGuard } from './auth/guards/admin.guard';
import { DealModule } from './deal/deal.module';
import { TransactionModule } from './transaction/transaction.module';
import { MoexModule } from './moex/moex.module';
import { GlobalHttpModule as HttpModule } from './http/http.module';
import { ExpertModule } from './expert/expert.module';
import { OpinionModule } from './opinion/opinion.module';
import { PositionModule } from './position/position.module';

const reflector = new Reflector();

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DealModule,
    ExpertModule,
    HttpModule,
    MoexModule,
    OpinionModule,
    PortfolioModule,
    PrismaModule,
    TransactionModule,
    UserModule,
    ExpertModule,
    OpinionModule,
    PositionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useValue: new SessionGuard(reflector),
    },
    {
      provide: APP_GUARD,
      useValue: new AdminGuard(reflector),
    },
  ],
})
export class AppModule {}
