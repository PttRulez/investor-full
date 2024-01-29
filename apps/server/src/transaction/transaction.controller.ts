import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ITransactionResponse } from 'contracts';
import { CreateTransactionDto, UpdateTransactionDto } from './transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @Body() dto: CreateTransactionDto,
  ): Promise<ITransactionResponse> {
    const transactionModel = await this.transactionService.create({ ...dto });
    return transactionModel.toJSON();
  }

  @Patch()
  async updateTransaction(
    @Body() dto: UpdateTransactionDto,
  ): Promise<ITransactionResponse> {
    const transactionModel = await this.transactionService.update({ ...dto });
    return transactionModel.toJSON();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteTransaction(
    @Param('id') id: string,
  ): Promise<ITransactionResponse> {
    const transactionModel = await this.transactionService.delete(parseInt(id));
    return transactionModel.toJSON();
  }
}
