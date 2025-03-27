
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ExpenseCategory, SplitMethod, Expense } from '@/utils/types';
import { format } from 'date-fns';

// Import the form sections
import ExpenseDetailsSection, { formSchema, FormValues } from './ExpenseDetailsSection';
import ReceiptUploadSection from './ReceiptUploadSection';
import NotesSection from './NotesSection';
import FormActions from './FormActions';

// Define props interface
interface ExpenseFormProps {
  expense?: Expense;
  onExpenseAdded?: () => void;
  onCancel?: () => void;
}

const ExpenseForm = ({ expense, onExpenseAdded, onCancel }: ExpenseFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!expense;
  
  const categories: ExpenseCategory[] = [
    'medical',
    'education',
    'clothing',
    'activities',
    'food',
    'other'
  ];
  
  const splitMethods: SplitMethod[] = [
    '50/50',
    'income-based',
    'custom'
  ];
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: expense ? {
      description: expense.description,
      amount: expense.amount.toString(),
      date: new Date(expense.date),
      category: expense.category,
      splitMethod: expense.splitMethod,
      notes: expense.notes || "",
    } : {
      description: "",
      amount: "",
      date: new Date(),
      category: "education",
      splitMethod: "50/50",
      notes: "",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error("You must be signed in to add an expense");
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isEditing && expense) {
        // Update existing expense
        const { data, error } = await supabase
          .from('expenses')
          .update({
            description: values.description,
            amount: parseFloat(values.amount),
            date: format(values.date, 'yyyy-MM-dd'),
            category: values.category,
            split_method: values.splitMethod,
            notes: values.notes || null
          })
          .eq('id', expense.id)
          .select();

        if (error) throw error;
        
        toast.success("Expense updated successfully");
      } else {
        // Add new expense
        const { data, error } = await supabase
          .from('expenses')
          .insert({
            description: values.description,
            amount: parseFloat(values.amount),
            date: format(values.date, 'yyyy-MM-dd'),
            category: values.category,
            paid_by: user.id,
            split_method: values.splitMethod,
            notes: values.notes || null,
            status: 'pending'
          })
          .select();

        if (error) throw error;
        
        toast.success("Expense added successfully");
      }
      
      form.reset();
      
      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (error) {
      console.error(isEditing ? "Error updating expense:" : "Error adding expense:", error);
      toast.error(isEditing ? "Failed to update expense" : "Failed to add expense");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-lg mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {isEditing ? "Edit Expense" : "Add New Expense"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ExpenseDetailsSection 
              form={form} 
              categories={categories} 
              splitMethods={splitMethods} 
            />
            
            <ReceiptUploadSection />
            
            <NotesSection form={form} />
            
            <FormActions 
              onCancel={onCancel} 
              isSubmitting={isSubmitting} 
              isEditing={isEditing}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
