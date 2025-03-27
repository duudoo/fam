
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './ExpenseDetailsSection';

interface NotesSectionProps {
  form: UseFormReturn<FormValues, any, undefined>;
}

const NotesSection = ({ form }: NotesSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes (optional)</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Add any additional details about this expense" 
              className="resize-none" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NotesSection;
