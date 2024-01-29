import { OpinionFilters } from 'contracts';
import { Body, Controller, Patch, Post } from '@nestjs/common';
import { OpinionService } from './opinion.service';
import { GetUserId } from 'src/auth/decorators';
import { CreateOpinionDto, UpdateOpinionDto } from './opinion.dto';

@Controller('opinion')
export class OpinionController {
  constructor(private opinionService: OpinionService) {}

  @Post()
  async createOpinion(
    @Body() dto: CreateOpinionDto,
    @GetUserId() userId: number,
  ) {
    const opinion = await this.opinionService.createOpinion({ ...dto, userId });
    return opinion.toJSON();
  }

  @Post('/list')
  async getOpinionsList(@Body() filters: OpinionFilters) {
    const opinions = await this.opinionService.getOpinionsList(filters);
    return opinions.map(o => o.toJSON());
  }

  @Patch()
  async updateOpinion(@Body() dto: UpdateOpinionDto) {
    const opinion = await this.opinionService.updateOpinion(dto);
    return opinion.toJSON();
  }
}
