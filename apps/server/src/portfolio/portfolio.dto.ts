import { CreatePortfolioSchema, UpdatePortfolioSchema } from 'contracts';
import { createZodDto } from 'nestjs-zod';

export class CreatePortfolioDto extends createZodDto(CreatePortfolioSchema) {}
export class UpdatePortfolioDto extends createZodDto(UpdatePortfolioSchema) {}
