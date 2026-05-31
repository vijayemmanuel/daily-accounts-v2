import { z } from 'zod';

export const rawDayExpenses = z.object({
    Date: z.string(),
    Food: z.string(),
    Transport: z.string(),
    Utility: z.string(),
    Other : z.string(),
    Adhoc: z.string()
});

const transformedYearlyExpenses = rawDayExpenses.transform((val) => {
    // 1. Remove hyphens from "2025-04-02" to get "20250402"
    const cleanDateStr = val.Date.replace(/-/g, ""); // "20250402"
    
    // 2. Extract Month 
    const month = cleanDateStr.slice(4, 6); // 01

    return {
        Month: month,
        Food: Number(val.Food || 0), // Handles missing or empty string values safely
        Transport: Number(val.Transport || 0),
        Utility: Number(val.Utility || 0),
        Other: Number(val.Other || 0),
        // Handles missing or empty string values safely
        Adhoc: Number(val.Adhoc || 0), 
    };
});

export const yearlyExpenses = z.object({
    message : z.array(transformedYearlyExpenses)
});

export default transformedYearlyExpenses;