
import * as z from "zod";

export const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  expenseAlerts: z.boolean().default(true),
  eventReminders: z.boolean().default(true),
  messageAlerts: z.boolean().default(true),
  frequency: z.string().default('immediate')
});

export type NotificationFormValues = z.infer<typeof notificationFormSchema>;
