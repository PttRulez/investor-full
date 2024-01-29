import { CreateTransactionSchema, UpdateTransactionSchema } from 'contracts';
import { createZodDto } from 'nestjs-zod';

export class CreateTransactionDto extends createZodDto(
  CreateTransactionSchema,
) {}
export class UpdateTransactionDto extends createZodDto(
  UpdateTransactionSchema,
) {}
