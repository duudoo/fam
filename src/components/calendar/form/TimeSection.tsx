
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./EventFormSchema";

interface TimeSectionProps {
  form: UseFormReturn<FormValues>;
  isAllDay: boolean;
}

const TimeSection = ({ form, isAllDay }: TimeSectionProps) => {
  if (isAllDay) return null;
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="startTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Time</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-400" />
                <Input
                  type="time"
                  {...field}
                  className="w-full"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="endTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Time</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-400" />
                <Input
                  type="time"
                  {...field}
                  className="w-full"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TimeSection;
