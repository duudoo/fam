
import { z } from "zod";
import { EventPriority, ReminderType } from "@/utils/types";

export const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  date: z.date({ required_error: "Event date is required" }),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  location: z.string().optional(),
  allDay: z.boolean().default(false),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  
  // Fields for recurring events
  isRecurring: z.boolean().default(false),
  recurrenceType: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
  recurrenceEndsOn: z.date().optional(),
  
  // Fields for reminders
  reminder: z.boolean().default(false),
  reminderTime: z.string().optional(),
  reminderType: z.enum(["push", "email", "sms"]).optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const defaultValues: FormValues = {
  title: "",
  date: new Date(),
  description: "",
  priority: "medium" as EventPriority,
  location: "",
  allDay: false,
  startTime: "09:00",
  endTime: "10:00",
  isRecurring: false,
  recurrenceType: "weekly",
  reminder: false,
  reminderTime: "30",
  reminderType: "push" as ReminderType,
};
