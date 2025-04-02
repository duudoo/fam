
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/integrations/supabase/client";
import { NotificationFormSection } from "./NotificationFormSection";
import { FrequencySelector } from "./FrequencySelector";
import { NotificationFormValues, notificationFormSchema } from "./types";

interface NotificationFormProps {
  userId?: string;
  initialValues?: NotificationFormValues;
  isLoading: boolean;
}

export const NotificationForm = ({
  userId,
  initialValues,
  isLoading,
}: NotificationFormProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: initialValues || {
      emailNotifications: true,
      expenseAlerts: true,
      eventReminders: true,
      messageAlerts: true,
      frequency: "immediate",
    },
  });

  const onSubmit = async (data: NotificationFormValues) => {
    if (!userId) {
      toast.error("You must be signed in to update notification settings");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("notification_preferences")
        .upsert({
          user_id: userId,
          email_notifications: data.emailNotifications,
          expense_alerts: data.expenseAlerts,
          event_reminders: data.eventReminders,
          message_alerts: data.messageAlerts,
          frequency: data.frequency,
        });

      if (error) throw error;

      toast.success("Notification settings updated");
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      toast.error("Failed to update notification settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NotificationFormSection
          form={form}
          name="emailNotifications"
          label="Email Notifications"
          description="Receive notifications via email"
        />

        <NotificationFormSection
          form={form}
          name="expenseAlerts"
          label="Expense Alerts"
          description="Get notified about new expenses and expense updates"
        />

        <NotificationFormSection
          form={form}
          name="eventReminders"
          label="Event Reminders"
          description="Receive reminders about upcoming events"
        />

        <NotificationFormSection
          form={form}
          name="messageAlerts"
          label="Message Alerts"
          description="Get notified about new messages"
        />

        <FrequencySelector form={form} />

        <Button type="submit" disabled={isLoading || isSaving}>
          {isSaving ? <Spinner size="sm" className="mr-2" /> : null}
          Save Notification Settings
        </Button>
      </form>
    </Form>
  );
};
