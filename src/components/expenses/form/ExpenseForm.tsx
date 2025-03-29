
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { useExpenseMutations } from '@/hooks/expenses';
import { Expense } from '@/utils/types';
import { ExpenseFormProvider } from './ExpenseFormContext';
import { processFormSubmission } from './expenseFormUtils';
import { formSchema, FormValues } from './ExpenseDetailsSection';
import ExpenseFormContent from './ExpenseFormContent';

interface ExpenseFormProps {
  expense?: Expense;
  onExpenseAdded?: () => void;
  onCancel?: () => void;
}

const ExpenseForm = ({ expense, onExpenseAdded, onCancel }: ExpenseFormProps) => {
  const { user } = useAuth();
  const { createExpense, updateExpense } = useExpenseMutations(user?.id);
  const isEditing = !!expense;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: expense ? {
      description: expense.description,
      amount: expense.amount.toString(),
      date: new Date(expense.date),
      category: expense.category,
      splitMethod: expense.splitMethod,
      notes: expense.notes || "",
      childIds: expense.childIds || []
    } : {
      description: "",
      amount: "",
      date: new Date(),
      category: "education",
      splitMethod: "50/50",
      notes: "",
      childIds: []
    },
  });
  
  const handleSubmit = async (values: FormValues) => {
    await processFormSubmission(
      values,
      isEditing,
      expense,
      undefined, // receiptUrl is managed by the context now
      user,
      createExpense,
      updateExpense,
      () => {}, // setIsSubmitting is managed by the context
      form.reset,
      () => {}, // setReceiptUrl is managed by the context
      onExpenseAdded
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
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <ExpenseFormContent form={form} />
            </form>
          </Form>
        </ExpenseFormProvider>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
