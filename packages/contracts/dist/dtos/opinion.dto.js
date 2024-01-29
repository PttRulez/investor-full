"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpinionFilters = exports.UpdateOpinionDto = exports.CreateOpinionDto = void 0;
var mapped_types_1 = require("@nestjs/mapped-types");
var class_validator_1 = require("class-validator");
var enums_1 = require("../other/enums");
var CreateOpinionDto = /** @class */ (function () {
    function CreateOpinionDto() {
    }
    __decorate([
        (0, class_validator_1.IsDateString)()
    ], CreateOpinionDto.prototype, "date", void 0);
    __decorate([
        (0, class_validator_1.IsEnum)(enums_1.Exchange)
    ], CreateOpinionDto.prototype, "exchange", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)()
    ], CreateOpinionDto.prototype, "expertId", void 0);
    __decorate([
        (0, class_validator_1.IsString)()
    ], CreateOpinionDto.prototype, "text", void 0);
    __decorate([
        (0, class_validator_1.IsEnum)(enums_1.SecurityType)
    ], CreateOpinionDto.prototype, "securityType", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)()
    ], CreateOpinionDto.prototype, "securityId", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)()
    ], CreateOpinionDto.prototype, "sourceLink", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)()
    ], CreateOpinionDto.prototype, "targetPrice", void 0);
    __decorate([
        (0, class_validator_1.IsEnum)(enums_1.OpinionType)
    ], CreateOpinionDto.prototype, "type", void 0);
    return CreateOpinionDto;
}());
exports.CreateOpinionDto = CreateOpinionDto;
var UpdateOpinionDto = /** @class */ (function (_super) {
    __extends(UpdateOpinionDto, _super);
    function UpdateOpinionDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, class_validator_1.IsNumber)()
    ], UpdateOpinionDto.prototype, "id", void 0);
    return UpdateOpinionDto;
}((0, mapped_types_1.PartialType)(CreateOpinionDto)));
exports.UpdateOpinionDto = UpdateOpinionDto;
var OpinionFilters = /** @class */ (function () {
    function OpinionFilters() {
    }
    __decorate([
        (0, class_validator_1.IsEnum)(enums_1.Exchange),
        (0, class_validator_1.IsOptional)()
    ], OpinionFilters.prototype, "exchange", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsOptional)()
    ], OpinionFilters.prototype, "expertId", void 0);
    __decorate([
        (0, class_validator_1.IsEnum)(enums_1.SecurityType),
        (0, class_validator_1.IsOptional)()
    ], OpinionFilters.prototype, "securityType", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsOptional)()
    ], OpinionFilters.prototype, "securityId", void 0);
    __decorate([
        (0, class_validator_1.IsEnum)(enums_1.OpinionType),
        (0, class_validator_1.IsOptional)()
    ], OpinionFilters.prototype, "type", void 0);
    return OpinionFilters;
}());
exports.OpinionFilters = OpinionFilters;
