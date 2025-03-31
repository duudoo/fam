
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
import { SplitMethod } from '@/utils/types';

const splitMethods: SplitMethod[] = [
  'none',
  '50/50',
  'custom'
];

const expenseFormSchema = z.object({
  defaultSplitMethod: z.string({
    required_error: "Please select a default split method",
  })
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export const DefaultSplitMethodForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // For now, default to 50/50. In a real app, this would be loaded from user preferences
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      defaultSplitMethod: '50/50',
    },
  });

  const onSubmit = async (data: ExpenseFormValues) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Expense settings updated");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="defaultSplitMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Split Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select default split method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {splitMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method === '50/50' ? '50/50 Split' : 
                       method === 'custom' ? 'Custom Split Ratio' : 
                       'No Split'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                This will be the default split method when creating new expenses.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
          Save Expense Settings
        </Button>
      </form>
    </Form>
  );
};
