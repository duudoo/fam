
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
import { Card } from "@/components/ui/card";

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
    <div className="space-y-6">
      <Card className="p-4 shadow-sm border-gray-100">
        <h3 className="text-base font-medium mb-4">Basic Information</h3>
        <div className="space-y-4">
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="e.g., School supplies" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <CategoryField control={control} />
            
            <FormField
              control={control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ({currency.symbol}) <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" type="number" step="0.01" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date <span className="text-red-500">*</span></FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal h-10 w-full",
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
      </Card>
      
      <Card className="p-4 shadow-sm border-gray-100">
        <h3 className="text-base font-medium mb-4">Children & Cost Splitting</h3>
        <div className="space-y-4">
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
        </div>
      </Card>
      
      <Card className="p-4 shadow-sm border-gray-100">
        <h3 className="text-base font-medium mb-4">Additional Information</h3>
        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional details about this expense..."
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Card>
    </div>
  );
};

export default ExpenseDetailsSection;
