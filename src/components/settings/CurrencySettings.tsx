
import { useState } from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormDescription,
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useCurrency, currencies } from '@/contexts/CurrencyContext';

const currencyFormSchema = z.object({
  currency: z.string({
    required_error: "Please select a currency",
  })
});

type CurrencyFormValues = z.infer<typeof currencyFormSchema>;

const CurrencySettings = () => {
  const { currency, saveCurrencyPreference, isLoading } = useCurrency();
  
  // Use current currency as default
  const form = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencyFormSchema),
    defaultValues: {
      currency: currency.code,
    },
  });

  const onSubmit = async (data: CurrencyFormValues) => {
    try {
      await saveCurrencyPreference(data.currency);
      toast.success("Currency settings updated");
    } catch (error) {
      console.error("Error saving currency:", error);
      toast.error("Failed to update currency settings");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Currency Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Set your preferred currency for displaying expenses
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  This currency will be used for all expenses and financial calculations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
            Save Currency Preference
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CurrencySettings;
