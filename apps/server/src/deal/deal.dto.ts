import { CreateDealSchema, UpdateDealSchema } from 'contracts';
import { createZodDto } from 'nestjs-zod';

export class CreateDealDto extends createZodDto(CreateDealSchema) {}
export class UpdateDealDto extends createZodDto(UpdateDealSchema) {}
