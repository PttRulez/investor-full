import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { DealService } from './deal.service';
import { CreateDealDto } from './deal.dto';
import { Deal } from './deal.model';

@Controller('deal')
export class DealController {
  constructor(private dealService: DealService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createDeal(@Body() dto: CreateDealDto): Promise<void> {
    const dealModel = new Deal(dto);
    await this.dealService.create(dto.ticker, dealModel);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteDeal(@Param() params: { id: string }): Promise<void> {
    await this.dealService.delete(parseInt(params.id));
  }
}
