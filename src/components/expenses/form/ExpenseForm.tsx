
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
  
  const form = useForm<FormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: expense ? {
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
    },
  });
  
  const handleSubmit = async (values: FormValues, event: any) => {
    const formAction = event?.nativeEvent?.submitter?.value;
    
    await processFormSubmission(
      values,
      isEditing,
      expense,
      receiptUrl,
      user,
      createExpense,
      updateExpense,
      setIsSubmitting,
      form.reset,
      setReceiptUrl,
      () => {
        if (formAction === 'saveAndAdd') {
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
        } else {
          // Close form
          if (onExpenseAdded) onExpenseAdded();
        }
      },
      formAction
    );
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
            </form>
          </Form>
        </ExpenseFormProvider>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
