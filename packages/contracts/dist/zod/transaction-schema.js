"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTransactionSchema = exports.CreateTransactionSchema = void 0;
var zod_1 = require("zod");
var enums_1 = require("../other/enums");
exports.CreateTransactionSchema = zod_1.z.object({
    amount: zod_1.z
        .number({
        errorMap: function (issue) { return ({
            message: "Введите сумму кэшаута",
        }); },
    })
        .int()
        .positive(),
    date: zod_1.z.date(),
    portfolioId: zod_1.z.number(),
    type: zod_1.z.nativeEnum(enums_1.TransactionType),
});
exports.UpdateTransactionSchema = exports.CreateTransactionSchema.partial().extend({
    id: zod_1.z.number(),
});
