
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./EventFormSchema";

interface ReminderSectionProps {
  form: UseFormReturn<FormValues>;
  hasReminder: boolean;
  setHasReminder: (value: boolean) => void;
}

const ReminderSection = ({ form, hasReminder, setHasReminder }: ReminderSectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="reminder"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center gap-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  setHasReminder(!!checked);
                }}
              />
            </FormControl>
            <div className="flex items-center">
              <Bell className="mr-2 h-4 w-4 text-gray-400" />
              <FormLabel className="mt-0">Add reminder</FormLabel>
            </div>
          </FormItem>
        )}
      />

      {hasReminder && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8 border-l-2 border-famacle-blue-light/30 ml-2">
          <FormField
            control={form.control}
            name="reminderTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remind me</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="10">10 minutes before</SelectItem>
                    <SelectItem value="30">30 minutes before</SelectItem>
                    <SelectItem value="60">1 hour before</SelectItem>
                    <SelectItem value="120">2 hours before</SelectItem>
                    <SelectItem value="1440">1 day before</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reminderType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notification Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="push">Push Notification</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </>
  );
};

export default ReminderSection;
