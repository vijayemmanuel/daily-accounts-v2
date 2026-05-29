import { z } from 'zod';

export const rawDayExpenses = z.object({
    Date: z.string(),
    Food: z.string(),
    Transport: z.string(),
    Utility: z.string(),
    Other : z.string(),
    Adhoc: z.string()
});

const rawMonthlyExpenses = z.object({
    message : z.array(rawDayExpenses)
});

export const ExpenseRequest = z.object({
    in: rawDayExpenses                     
});

export default rawMonthlyExpenses;