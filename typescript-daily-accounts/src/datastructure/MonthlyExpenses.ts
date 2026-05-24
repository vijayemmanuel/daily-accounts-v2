import { z } from 'zod';

const rawMonthlyExpenses = z.object({
    message : z.array(
        z.object({
            Date: z.string(),
            Food: z.string(),
            Transport: z.string(),
            Utility: z.string(),
            Other : z.string()
        })
    )
});

export const rawDayExpenses = z.object({
    Date: z.string(),
    Food: z.string(),
    Transport: z.string(),
    Utility: z.string(),
    Other : z.string()
});

export const ExpenseRequest = z.object({
    in: rawDayExpenses                     
});

export default rawMonthlyExpenses;