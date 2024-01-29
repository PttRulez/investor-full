import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ExpertService } from './expert.service';
import { CreateExpertDto, UpdateExpertDto } from './expert.dto';
import { IExpertResponse } from 'contracts';
import { GetUserId } from 'src/auth/decorators';

@Controller('expert')
export class ExpertController {
  constructor(private expertService: ExpertService) {}

  @Get()
  async getExpertsList(): Promise<IExpertResponse[]> {
    const experts = await this.expertService.getExpertsList();
    return experts.map(e => e.toJSON());
  }

  @Post()
  async createExpert(
    @Body() dto: CreateExpertDto,
    @GetUserId() userId: number,
  ): Promise<IExpertResponse> {
    const expert = await this.expertService.create(
      dto.name,
      userId,
      dto.avatarUrl,
    );
    return expert.toJSON();
  }

  @Get(':id')
  async getExpertWithOpinions(
    @Param('id') expertId: number,
  ): Promise<IExpertResponse> {
    const expert = await this.expertService.getExpertWithOpinions(expertId);
    if (!expert) {
      throw new HttpException(
        'Эксперта с таким айди не найдено',
        HttpStatus.NOT_FOUND,
      );
    }
    return expert.toJSON();
  }

  @Patch()
  async updateExpert(@Body() dto: UpdateExpertDto): Promise<IExpertResponse> {
    const { id, ...dataToPatch } = dto;
    const expert = await this.expertService.update(id, dataToPatch);
    return expert.toJSON();
  }
}
