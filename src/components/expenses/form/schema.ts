
import { z } from 'zod';

// Form schema for expense validation
export const expenseFormSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  category: z.string(),
  splitMethod: z.string(),
  splitPercentage: z.record(z.string(), z.number()).optional(),
  notes: z.string().optional(),
  childIds: z.array(z.string()).optional(),
});

export type FormValues = z.infer<typeof expenseFormSchema>;
