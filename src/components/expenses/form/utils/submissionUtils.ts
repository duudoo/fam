
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { toast } from 'sonner';
import { FormValues } from '../schema';
import { sendExpenseNotification } from './notificationUtils';

export const processFormSubmission = async (
  values: FormValues, 
  isEditing: boolean, 
  expense: any, 
  receiptUrl: string, 
  user: any,
  createExpense: any,
  updateExpense: any,
  setIsSubmitting: (value: boolean) => void,
  resetForm: () => void,
  setReceiptUrl: (url: string) => void,
  onExpenseAdded?: () => void
) => {
  if (!user) {
    toast.error("You must be signed in to add an expense");
    return;
  }

  setIsSubmitting(true);
  
  try {
    if (isEditing && expense) {
      await handleExpenseUpdate(
        expense.id,
        values,
        receiptUrl,
        updateExpense
      );
    } else {
      await handleExpenseCreation(
        values,
        receiptUrl,
        user,
        createExpense
      );
    }
    
    resetForm();
    setReceiptUrl('');
    
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

// Helper function to handle expense update
const handleExpenseUpdate = async (
  expenseId: string, 
  values: FormValues, 
  receiptUrl: string, 
  updateExpense: any
) => {
  await updateExpense.mutateAsync({
    id: expenseId,
    updates: {
      description: values.description,
      amount: parseFloat(values.amount),
      date: format(values.date, 'yyyy-MM-dd'),
      category: values.category,
      splitMethod: values.splitMethod,
      notes: values.notes || undefined,
      receiptUrl: receiptUrl || undefined,
      childIds: values.childIds
    }
  });
};

// Helper function to handle expense creation
const handleExpenseCreation = async (
  values: FormValues, 
  receiptUrl: string, 
  user: any, 
  createExpense: any
) => {
  const newExpense = await createExpense.mutateAsync({
    description: values.description,
    amount: parseFloat(values.amount),
    date: format(values.date, 'yyyy-MM-dd'),
    category: values.category,
    status: 'pending',
    splitMethod: values.splitMethod,
    notes: values.notes || undefined,
    receiptUrl: receiptUrl || undefined,
    paidBy: user.id,
    childIds: values.childIds
  });
  
  if (newExpense) {
    const { data: expenseData, error: expenseError } = await supabase
      .from('expenses')
      .select('id, approval_token')
      .eq('id', newExpense.id)
      .single();
      
    if (!expenseError && expenseData) {
      await sendExpenseNotification({
        id: newExpense.id,
        description: values.description,
        amount: values.amount,
        date: format(values.date, 'yyyy-MM-dd'),
        category: values.category,
        splitMethod: values.splitMethod,
        childIds: values.childIds,
        receiptUrl: receiptUrl
      }, expenseData.approval_token, user.id);
    }
  }
};
