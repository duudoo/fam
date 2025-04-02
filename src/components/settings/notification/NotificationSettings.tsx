
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/integrations/supabase/client";
import { NotificationForm } from "./NotificationForm";
import { NotificationFormValues } from "./types";

const NotificationSettings = () => {
  const { user } = useAuth();
  const [isFetching, setIsFetching] = useState(true);
  const [preferences, setPreferences] = useState<NotificationFormValues | undefined>();

  // Fetch saved preferences when component mounts
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user?.id) return;

      try {
        setIsFetching(true);
        const { data, error } = await supabase
          .from("notification_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGSQL_ERROR") {
          console.error("Error fetching notification preferences:", error);
          return;
        }

        if (data) {
          setPreferences({
            emailNotifications: data.email_notifications,
            expenseAlerts: data.expense_alerts,
            eventReminders: data.event_reminders,
            messageAlerts: data.message_alerts,
            frequency: data.frequency,
          });
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchPreferences();
  }, [user?.id]);

  if (isFetching) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Customize when and how you receive notifications
        </p>
      </div>

      <NotificationForm
        userId={user?.id}
        initialValues={preferences}
        isLoading={isFetching}
      />
    </div>
  );
};

export default NotificationSettings;
