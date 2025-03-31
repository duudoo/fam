
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { useExpenseMutations } from '@/hooks/expenses';
import { Expense } from '@/utils/types';
import { ExpenseFormProvider } from './ExpenseFormContext';
import { processFormSubmission } from './expenseFormUtils';
import { expenseFormSchema, FormValues } from './schema';
import ExpenseFormContent from './ExpenseFormContent';
import { useState } from 'react';
import { toast } from 'sonner';

interface ExpenseFormProps {
  expense?: Expense;
  onExpenseAdded?: () => void;
  onCancel?: () => void;
}

const ExpenseForm = ({ expense, onExpenseAdded, onCancel }: ExpenseFormProps) => {
  const { user } = useAuth();
  const { createExpense, updateExpense } = useExpenseMutations(user?.id);
  const isEditing = !!expense;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState(expense?.receiptUrl || '');
  
  const defaultValues = expense ? {
    description: expense.description,
    amount: expense.amount.toString(),
    date: new Date(expense.date),
    category: expense.category,
    splitMethod: expense.splitMethod,
    notes: expense.notes || "",
    childIds: expense.childIds || [],
    splitPercentage: expense.splitPercentage || undefined
  } : {
    description: "",
    amount: "",
    date: new Date(),
    category: "education",
    splitMethod: "50/50",
    notes: "",
    childIds: [],
    splitPercentage: undefined
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: defaultValues,
  });
  
  const handleSubmit = async (values: FormValues, event: React.FormEvent<HTMLFormElement>) => {
    if (!user) {
      toast.error("You must be signed in to add an expense");
      return;
    }
    
    // Get the action from the hidden input field
    const formElement = event.target as HTMLFormElement;
    const actionInput = formElement.querySelector('#form-action') as HTMLInputElement;
    const formAction = actionInput?.value;
    
    console.log("Form submission triggered with action:", formAction);
    
    try {
      setIsSubmitting(true);
      
      await processFormSubmission(
        values,
        isEditing,
        expense,
        receiptUrl,
        user,
        createExpense,
        updateExpense,
        formAction
      );
      
      // Handle post-submission actions
      if (formAction === 'saveAndAdd') {
        console.log("Save and add another option selected, resetting form...");
        // Reset form but don't close it
        form.reset({
          description: "",
          amount: "",
          date: new Date(),
          category: "education",
          splitMethod: "50/50",
          notes: "",
          childIds: [],
          splitPercentage: undefined
        });
        setReceiptUrl('');
      } else {
        // Close form and reset
        console.log("Standard save option selected, closing form...");
        form.reset();
        setReceiptUrl('');
        if (onExpenseAdded) onExpenseAdded();
      }
    } catch (error) {
      console.error("Error processing expense:", error);
    } finally {
      setIsSubmitting(false);
      // Clear the action input value after form submission
      if (actionInput) {
        actionInput.value = '';
      }
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
        <ExpenseFormProvider 
          expense={expense}
          onExpenseAdded={onExpenseAdded}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          receiptUrl={receiptUrl}
          setReceiptUrl={setReceiptUrl}
        >
          <Form {...form}>
            <form 
              id="expense-form"
              onSubmit={form.handleSubmit(handleSubmit)} 
              className="space-y-6"
            >
              <ExpenseFormContent form={form} />
              <input type="hidden" id="form-action" name="form-action" value="" />
            </form>
          </Form>
        </ExpenseFormProvider>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
