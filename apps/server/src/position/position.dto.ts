import { UpdatePositionSchema } from 'contracts';
import { createZodDto } from 'nestjs-zod';

export class UpdatePositionDto extends createZodDto(UpdatePositionSchema) {}
