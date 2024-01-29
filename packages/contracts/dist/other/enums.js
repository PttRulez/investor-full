"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoexSecurityType = exports.MoexBoard = exports.MoexMarket = exports.MoexEngine = exports.TransactionType = exports.SecurityType = exports.Role = exports.OpinionType = exports.DealType = exports.Exchange = void 0;
var Exchange;
(function (Exchange) {
    Exchange["MOEX"] = "MOEX";
})(Exchange || (exports.Exchange = Exchange = {}));
var DealType;
(function (DealType) {
    DealType["BUY"] = "BUY";
    DealType["SELL"] = "SELL";
})(DealType || (exports.DealType = DealType = {}));
var OpinionType;
(function (OpinionType) {
    OpinionType["FLAT"] = "FLAT";
    OpinionType["GENERAL"] = "GENERAL";
    OpinionType["GROWTH"] = "GROWTH";
    OpinionType["REDUCTION"] = "REDUCTION";
})(OpinionType || (exports.OpinionType = OpinionType = {}));
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["INVESTOR"] = "INVESTOR";
})(Role || (exports.Role = Role = {}));
var SecurityType;
(function (SecurityType) {
    SecurityType["BOND"] = "BOND";
    SecurityType["CURRENCY"] = "CURRENCY";
    SecurityType["FUTURES"] = "FUTURES";
    SecurityType["INDEX"] = "INDEX";
    SecurityType["PIF"] = "PIF";
    SecurityType["SHARE"] = "SHARE";
})(SecurityType || (exports.SecurityType = SecurityType = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["CASHOUT"] = "CASHOUT";
    TransactionType["DEPOSIT"] = "DEPOSIT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
//  MOEX
var MoexEngine;
(function (MoexEngine) {
    MoexEngine["stock"] = "stock";
    MoexEngine["currency"] = "currency";
})(MoexEngine || (exports.MoexEngine = MoexEngine = {}));
var MoexMarket;
(function (MoexMarket) {
    MoexMarket["shares"] = "shares";
    MoexMarket["bonds"] = "bonds";
    MoexMarket["index"] = "index";
    MoexMarket["selt"] = "selt"; // Валюта: Биржевые сделки с ЦК
})(MoexMarket || (exports.MoexMarket = MoexMarket = {}));
var MoexBoard;
(function (MoexBoard) {
    MoexBoard["TQBR"] = "TQBR";
    MoexBoard["CETS"] = "CETS"; // Системные сделки - безадрес.
})(MoexBoard || (exports.MoexBoard = MoexBoard = {}));
var MoexSecurityType;
(function (MoexSecurityType) {
    MoexSecurityType["common_share"] = "common_share";
    MoexSecurityType["preferred_share"] = "preferred_share";
    MoexSecurityType["corporate_bond"] = "corporate_bond";
    MoexSecurityType["exchange_bond"] = "exchange_bond";
    MoexSecurityType["ofz_bond"] = "ofz_bond";
    MoexSecurityType["exchange_ppif"] = "exchange_ppif";
    MoexSecurityType["public_ppif"] = "public_ppif";
    MoexSecurityType["stock_index_if"] = "stock_index_if";
    MoexSecurityType["futures"] = "futures";
    MoexSecurityType["stock_index"] = "stock_index";
})(MoexSecurityType || (exports.MoexSecurityType = MoexSecurityType = {}));
