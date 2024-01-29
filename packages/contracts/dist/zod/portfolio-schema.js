"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePortfolioSchema = exports.CreatePortfolioSchema = void 0;
var zod_1 = require("zod");
exports.CreatePortfolioSchema = zod_1.z.object({
    name: zod_1.z.string(),
    compound: zod_1.z.boolean(),
});
exports.UpdatePortfolioSchema = exports.CreatePortfolioSchema.partial().extend({
    id: zod_1.z.number(),
});
