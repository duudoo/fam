
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from 'react-hook-form';
import { SplitMethod } from '@/utils/types';
import { FormValues } from '../schema';

interface SplitMethodFieldProps {
  form: UseFormReturn<FormValues, any, undefined>;
  splitMethods: SplitMethod[];
}

export const SplitMethodField = ({ form, splitMethods }: SplitMethodFieldProps) => {
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
                  {method}
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
