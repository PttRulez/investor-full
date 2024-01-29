import { CreateExpertSchema, UpdateExpertSchema } from 'contracts';
import { createZodDto } from 'nestjs-zod';

export class CreateExpertDto extends createZodDto(CreateExpertSchema) {}
export class UpdateExpertDto extends createZodDto(UpdateExpertSchema) {}
