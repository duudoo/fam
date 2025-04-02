
import { useState, useEffect } from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormDescription
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  expenseAlerts: z.boolean().default(true),
  eventReminders: z.boolean().default(true),
  messageAlerts: z.boolean().default(true),
  frequency: z.string().default('immediate')
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

const NotificationSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      expenseAlerts: true,
      eventReminders: true,
      messageAlerts: true,
      frequency: 'immediate'
    },
  });

  // Fetch saved preferences when component mounts
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user?.id) return;
      
      try {
        setIsFetching(true);
        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGSQL_ERROR') {
          console.error('Error fetching notification preferences:', error);
          return;
        }
        
        if (data) {
          form.reset({
            emailNotifications: data.email_notifications,
            expenseAlerts: data.expense_alerts,
            eventReminders: data.event_reminders,
            messageAlerts: data.message_alerts,
            frequency: data.frequency
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchPreferences();
  }, [user?.id, form]);

  const onSubmit = async (data: NotificationFormValues) => {
    if (!user?.id) {
      toast.error("You must be signed in to update notification settings");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          email_notifications: data.emailNotifications,
          expense_alerts: data.expenseAlerts,
          event_reminders: data.eventReminders,
          message_alerts: data.messageAlerts,
          frequency: data.frequency
        });
      
      if (error) throw error;
      
      toast.success("Notification settings updated");
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast.error("Failed to update notification settings");
    } finally {
      setIsLoading(false);
    }
  };

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
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Email Notifications</FormLabel>
                  <FormDescription>
                    Receive notifications via email
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expenseAlerts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Expense Alerts</FormLabel>
                  <FormDescription>
                    Get notified about new expenses and expense updates
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="eventReminders"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Event Reminders</FormLabel>
                  <FormDescription>
                    Receive reminders about upcoming events
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="messageAlerts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Message Alerts</FormLabel>
                  <FormDescription>
                    Get notified about new messages
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notification Frequency</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select notification frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How often you want to receive notification updates
                </FormDescription>
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
            Save Notification Settings
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NotificationSettings;
