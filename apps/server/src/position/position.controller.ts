import { Body, Controller, Param, Patch, Res } from '@nestjs/common';
import { GetUserId } from 'src/auth/decorators';
import { PositionService } from './position.service';
import { OpinionService } from 'src/opinion/opinion.service';
import { UpdatePositionDto } from './position.dto';
import { Response } from 'express';

@Controller('position')
export class PositionController {
  constructor(
    private readonly positionService: PositionService,
    private readonly opinionService: OpinionService,
  ) {}

  @Patch(':id')
  async update(
    @GetUserId() userId: number,
    @Body() updateData: UpdatePositionDto,
    @Param('id') positionId: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.positionService.updateOne(+positionId, userId, updateData);
      res.status(200).send();
    } catch (e) {
      console.log('error:', e);
      res.status(500).send({ message: 'Error happened :)' });
    }
  }
}
