import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import CategoryField from "./fields/CategoryField";
import SplitMethodField from "@/components/expenses/form/SplitMethodField";
import { Control, useFormContext } from "react-hook-form";
import { FormValues } from "./schema";
import CustomSplitField from "./CustomSplitField";
import SplitPreview from "./SplitPreview";
import ChildrenSelectionSection from "./ChildrenSelectionSection";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ExpenseDetailsSectionProps {
  control: Control<FormValues>;
}

const ExpenseDetailsSection = ({ control }: ExpenseDetailsSectionProps) => {
  const { watch } = useFormContext();
  const { currency } = useCurrency();
  const splitMethod = watch('splitMethod');
  const showCustomSplit = splitMethod === 'custom';
  const selectedChildIds = watch('childIds') || [];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., School supplies" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount ({currency.symbol})</FormLabel>
              <FormControl>
                <Input placeholder="0.00" type="number" step="0.01" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CategoryField control={control} />
        
        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <ChildrenSelectionSection defaultSelectedIds={selectedChildIds} />
      
      <div className="border-t pt-4">
        <div className="space-y-4">
          <SplitMethodField control={control} />
          
          {showCustomSplit && (
            <CustomSplitField 
              control={control}
              selectedChildIds={selectedChildIds}
            />
          )}
          
          <SplitPreview control={control} />
        </div>
      </div>
      
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes (optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Add any additional details about this expense..."
                className="resize-none"
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ExpenseDetailsSection;
