
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from 'react-hook-form';
import { SplitMethod } from '@/utils/types';
import { FormValues } from '../schema';
import { useEffect } from 'react';

interface SplitMethodFieldProps {
  form: UseFormReturn<FormValues, any, undefined>;
  splitMethods: SplitMethod[];
  onSplitMethodChange?: (method: SplitMethod) => void;
}

export const SplitMethodField = ({ form, splitMethods, onSplitMethodChange }: SplitMethodFieldProps) => {
  // When split method changes, notify parent component
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'splitMethod' && onSplitMethodChange) {
        onSplitMethodChange(value.splitMethod as SplitMethod);
        console.log('Split method changed to:', value.splitMethod);
        
        // If the split method is not 'custom', clear any existing splitPercentage
        if (value.splitMethod !== 'custom') {
          form.setValue('splitPercentage', undefined);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, onSplitMethodChange]);

  return (
    <FormField
      control={form.control}
      name="splitMethod"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Split Method</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select split method" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {splitMethods.map((method) => (
                <SelectItem key={method} value={method}>
                  {method === "50/50" ? "50/50 Split" : 
                   method === "custom" ? "Custom Split" : 
                   "No Split"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
