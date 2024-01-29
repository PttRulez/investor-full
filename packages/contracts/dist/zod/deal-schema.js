"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDealSchema = exports.CreateDealSchema = void 0;
var zod_1 = require("zod");
var enums_1 = require("../other/enums");
exports.CreateDealSchema = zod_1.z.object({
    amount: zod_1.z
        .number({
        errorMap: function (issue) { return ({
            message: "Введите кол-во бумаг",
        }); },
    })
        .int()
        .positive(),
    date: zod_1.z.date(),
    exchange: zod_1.z.nativeEnum(enums_1.Exchange),
    portfolioId: zod_1.z.number(),
    price: zod_1.z.number({
        errorMap: function (issue) { return ({
            message: "Введите стоимость сделки",
        }); },
    }),
    securityType: zod_1.z.nativeEnum(enums_1.SecurityType),
    ticker: zod_1.z
        .string({
        errorMap: function (issue) { return ({
            message: "Выберите инструмент",
        }); },
    })
        .trim()
        .min(1, "Выберите инструмент"),
    type: zod_1.z.nativeEnum(enums_1.DealType),
});
exports.UpdateDealSchema = exports.CreateDealSchema.partial().extend({
    id: zod_1.z.number(),
});
