import { z } from 'zod';

const rawDbExpenses = z.object({
    Day:z.number(),
    YearMonth: z.number(),
    Food: z.number(),
    Transport: z.number(),
    Utility: z.number(),
    Other: z.number(),
    Adhoc : z.number().optional()
});
const rawDbExpensesArray = z.array(rawDbExpenses);

const transformedDbExpenseOut = rawDbExpenses.transform((val) => {

  return {
    Date: val.YearMonth.toString()+val.Day.toString().padStart(2, "0"),
    Food: val.Food.toString(),
    Transport: val.Transport.toString(),
    Utility: val.Utility.toString(),
    Other: val.Other.toString(),
    Adhoc: val.Adhoc ? val.Adhoc.toString() : "0" 
  };
});

const respExpArray = z.array(transformedDbExpenseOut);

const respExpenses = respExpArray.transform(message => {
    return { message }
});


const reqRawExpenses = z.object({
    Date: z.string(),
    Food: z.string(),
    Transport: z.string(),
    Utility: z.string(),
    Other : z.string(),
    Adhoc : z.string().optional()
});

const reqExpenses = z.object({
    in: reqRawExpenses                     
});

const transformedDbExpenseIn = reqRawExpenses.transform((val) => {
  // 1. Remove hyphens from "2025-04-02" to get "20250402"
  const cleanDateStr = val.Date.replace(/-/g, ""); // "20250402"

  // 2. Extract YearMonth (first 6 chars) and Day (last 2 chars)
  const yearMonth = parseInt(cleanDateStr.slice(0, 6), 10); // 202504
  const day = parseInt(cleanDateStr.slice(-2), 10);          // 2

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

export { respExpenses, 
    rawDbExpenses, 
    rawDbExpensesArray, 
    transformedDbExpenseOut, 
    respExpArray, 
    transformedDbExpenseIn, 
    reqExpenses };