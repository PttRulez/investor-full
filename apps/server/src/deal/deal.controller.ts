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
import { Deal } from './deal.model';
import { CreateDealDto } from './deal.dto';
import { IDealResponse } from 'contracts';

@Controller('deal')
export class DealController {
  constructor(private dealService: DealService) {}

  @Post()
  async createDeal(@Body() dto: CreateDealDto): Promise<IDealResponse> {
    const deal = await this.dealService.create(dto.ticker, new Deal(dto));
    return deal.toJSON();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteDeal(@Param() params: { id: string }): Promise<IDealResponse> {
    const deal = await this.dealService.delete(parseInt(params.id));
    return deal.toJSON();
  }
}
