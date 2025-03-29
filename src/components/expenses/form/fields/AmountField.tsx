
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../schema';
import { useCurrency } from '@/contexts/CurrencyContext';

interface AmountFieldProps {
  form: UseFormReturn<FormValues, any, undefined>;
}

export const AmountField = ({ form }: AmountFieldProps) => {
  const { currency } = useCurrency();
  
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Amount ({currency.symbol})</FormLabel>
          <FormControl>
            <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
