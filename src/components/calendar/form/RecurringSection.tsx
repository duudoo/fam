
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Repeat } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./EventFormSchema";

interface RecurringSectionProps {
  form: UseFormReturn<FormValues>;
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
}

const RecurringSection = ({ form, isRecurring, setIsRecurring }: RecurringSectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="isRecurring"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center gap-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  setIsRecurring(!!checked);
                }}
              />
            </FormControl>
            <div className="flex items-center">
              <Repeat className="mr-2 h-4 w-4 text-gray-400" />
              <FormLabel className="mt-0">Recurring event</FormLabel>
            </div>
          </FormItem>
        )}
      />

      {isRecurring && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8 border-l-2 border-famacle-blue-light/30 ml-2">
          <FormField
            control={form.control}
            name="recurrenceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeat</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recurrenceEndsOn"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ends On</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select end date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => 
                        date < form.getValues().date
                      }
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </>
  );
};

export default RecurringSection;
