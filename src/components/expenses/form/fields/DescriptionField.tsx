
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../schema';

interface DescriptionFieldProps {
  form: UseFormReturn<FormValues, any, undefined>;
}

export const DescriptionField = ({ form }: DescriptionFieldProps) => {
  return (
    <FormField
      control={form.control}
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
  );
};
