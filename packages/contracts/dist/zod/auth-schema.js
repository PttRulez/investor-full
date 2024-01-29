"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = exports.LoginSchema = void 0;
var zod_1 = require("zod");
var enums_1 = require("../other/enums");
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.RegisterSchema = exports.LoginSchema.extend({
    name: zod_1.z.string(),
    role: zod_1.z.nativeEnum(enums_1.Role).optional(),
});
