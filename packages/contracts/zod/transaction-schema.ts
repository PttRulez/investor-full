import { z } from "zod";
import { TransactionType } from "../other/enums";

export const CreateTransactionSchema = z.object({
  amount: z
    .number({
      errorMap: (issue) => ({
        message: "Введите сумму кэшаута",
      }),
    })
    .int()
    .positive(),
  date: z.date(),
  portfolioId: z.number(),
  type: z.nativeEnum(TransactionType),
});

export const UpdateTransactionSchema = CreateTransactionSchema.partial().extend(
  {
    id: z.number(),
  },
);

export type CreateTransactionData = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionData = z.infer<typeof UpdateTransactionSchema>;
