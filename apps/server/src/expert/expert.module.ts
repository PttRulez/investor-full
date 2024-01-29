import { Module } from '@nestjs/common';
import { ExpertService } from './expert.service';
import { ExpertController } from './expert.controller';

@Module({
  providers: [ExpertService],
  controllers: [ExpertController]
})
export class ExpertModule {}
