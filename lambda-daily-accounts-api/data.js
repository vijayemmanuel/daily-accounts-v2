"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reqExpenses = exports.transformedDbExpenseIn = exports.respExpArray = exports.transformedDbExpenseOut = exports.rawDbExpensesArray = exports.rawDbExpenses = exports.respExpenses = void 0;
const zod_1 = require("zod");
const rawDbExpenses = zod_1.z.object({
    Day: zod_1.z.number(),
    YearMonth: zod_1.z.number(),
    Food: zod_1.z.number(),
    Transport: zod_1.z.number(),
    Utility: zod_1.z.number(),
    Other: zod_1.z.number(),
    Adhoc: zod_1.z.number().optional()
});
exports.rawDbExpenses = rawDbExpenses;
const rawDbExpensesArray = zod_1.z.array(rawDbExpenses);
exports.rawDbExpensesArray = rawDbExpensesArray;
const transformedDbExpenseOut = rawDbExpenses.transform((val) => {
    return {
        Date: val.YearMonth.toString() + val.Day.toString().padStart(2, "0"),
        Food: val.Food.toString(),
        Transport: val.Transport.toString(),
        Utility: val.Utility.toString(),
        Other: val.Other ? val.Other.toString() : "0",
        Adhoc: val.Adhoc ? val.Adhoc.toString() : "0"
    };
});
exports.transformedDbExpenseOut = transformedDbExpenseOut;
const respExpArray = zod_1.z.array(transformedDbExpenseOut);
exports.respExpArray = respExpArray;
const respExpenses = respExpArray.transform(message => {
    return { message };
});
exports.respExpenses = respExpenses;
const reqRawExpenses = zod_1.z.object({
    Date: zod_1.z.string(),
    Food: zod_1.z.string(),
    Transport: zod_1.z.string(),
    Utility: zod_1.z.string(),
    Other: zod_1.z.string(),
    Adhoc: zod_1.z.string().optional()
});
const reqExpenses = zod_1.z.object({
    in: reqRawExpenses
});
exports.reqExpenses = reqExpenses;
const transformedDbExpenseIn = reqRawExpenses.transform((val) => {
    // 1. Remove hyphens from "2025-04-02" to get "20250402"
    const cleanDateStr = val.Date.replace(/-/g, ""); // "20250402"
    // 2. Extract YearMonth (first 6 chars) and Day (last 2 chars)
    const yearMonth = parseInt(cleanDateStr.slice(0, 6), 10); // 202504
    const day = parseInt(cleanDateStr.slice(-2), 10); // 2
    return {
        Day: day,
        YearMonth: yearMonth,
        // Use Number() or parseInt() instead of z.number().parse()
        Food: Number(val.Food),
        Transport: Number(val.Transport),
        Utility: Number(val.Utility),
        Other: Number(val.Other),
        // Handles missing or empty string values safely
        Adhoc: Number(val.Adhoc || 0),
    };
});
exports.transformedDbExpenseIn = transformedDbExpenseIn;
