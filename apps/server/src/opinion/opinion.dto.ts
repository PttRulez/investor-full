import { CreateOpinionSchema, UpdateOpinionSchema } from 'contracts';
import { createZodDto } from 'nestjs-zod';

export class CreateOpinionDto extends createZodDto(CreateOpinionSchema) {}
export class UpdateOpinionDto extends createZodDto(UpdateOpinionSchema) {}
