"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExpertSchema = exports.CreateExpertSchema = void 0;
var zod_1 = require("zod");
exports.CreateExpertSchema = zod_1.z.object({
    avatarUrl: zod_1.z.string().optional(),
    name: zod_1.z
        .string({
        errorMap: function (issue) { return ({
            message: "Введите имя эксперта",
        }); },
    })
        .trim()
        .min(1, "Введите имя эксперта"),
});
exports.UpdateExpertSchema = exports.CreateExpertSchema.partial().extend({
    id: zod_1.z.number(),
});
