"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpinionFiltersSchema = exports.UpdateOpinionSchema = exports.CreateOpinionSchema = void 0;
var zod_1 = require("zod");
var enums_1 = require("../other/enums");
exports.CreateOpinionSchema = zod_1.z.object({
    date: zod_1.z.date(),
    exchange: zod_1.z.nativeEnum(enums_1.Exchange),
    expertId: zod_1.z.number(),
    text: zod_1.z.string(),
    securityType: zod_1.z.nativeEnum(enums_1.SecurityType),
    securityId: zod_1.z.number(),
    sourceLink: zod_1.z.string().optional(),
    targetPrice: zod_1.z.number().optional(),
    type: zod_1.z.nativeEnum(enums_1.OpinionType),
});
exports.UpdateOpinionSchema = exports.CreateOpinionSchema.partial().extend({
    id: zod_1.z.number(),
});
exports.OpinionFiltersSchema = zod_1.z.object({
    exchange: zod_1.z.nativeEnum(enums_1.Exchange).optional(),
    expertId: zod_1.z.number().optional(),
    securityType: zod_1.z.nativeEnum(enums_1.SecurityType).optional(),
    securityId: zod_1.z.number().optional(),
    type: zod_1.z.nativeEnum(enums_1.OpinionType).optional(),
});
