
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { FormValues } from '../schema';
import { sendExpenseNotification } from './notificationUtils';
import { toast } from "sonner";

export const processFormSubmission = async (
  values: FormValues, 
  isEditing: boolean, 
  expense: any, 
  receiptUrl: string, 
  user: any,
  createExpense: any,
  updateExpense: any,
  formAction?: string
) => {
  console.log("Processing expense submission:", { values, isEditing, formAction });
  
  try {
    let newExpense;
    
    if (isEditing && expense) {
      newExpense = await handleExpenseUpdate(
        expense.id,
        values,
        receiptUrl,
        updateExpense
      );
      
      // Show confirmation toast for update
      toast.success(`Expense "${values.description}" updated successfully`, {
        duration: 3000,
        position: 'top-center',
      });
    } else {
      newExpense = await handleExpenseCreation(
        values,
        receiptUrl,
        user,
        createExpense,
        formAction
      );
      
      // Show specific confirmation toast based on action
      if (formAction === 'saveAndAdd') {
        toast.success(`Expense "${values.description}" saved. You can add another one.`, {
          duration: 3000,
          position: 'top-center',
        });
      } else if (formAction === 'saveAndShare') {
        toast.success(`Expense "${values.description}" saved and ready to share.`, {
          duration: 3000,
          position: 'top-center',
        });
      } else {
        toast.success(`Expense "${values.description}" created successfully`, {
          duration: 3000,
          position: 'top-center',
        });
      }
      
      if (newExpense && formAction === 'saveAndShare') {
        // Get the co-parent email from the form submission
        const coParentEmail = document.querySelector('input[type="email"]') as HTMLInputElement;
        if (coParentEmail && coParentEmail.value) {
          await sendExpenseToCoParent(newExpense.id, coParentEmail.value, values, user);
        }
      }
    }
    
    console.log("Expense successfully processed:", newExpense);
    return newExpense;
  } catch (error) {
    console.error(isEditing ? "Error updating expense:" : "Error adding expense:", error);
    // Show error toast
    toast.error(`Failed to ${isEditing ? 'update' : 'create'} expense. Please try again.`, {
      duration: 4000,
      position: 'top-center',
    });
    throw error;
  }
};

// Helper function to handle expense update
const handleExpenseUpdate = async (
  expenseId: string, 
  values: FormValues, 
  receiptUrl: string, 
  updateExpense: any
) => {
  console.log("Updating expense:", expenseId);
  
  return await updateExpense.mutateAsync({
    id: expenseId,
    updates: {
      description: values.description,
      amount: parseFloat(values.amount),
      date: format(values.date, 'yyyy-MM-dd'),
      category: values.category,
      splitMethod: values.splitMethod,
      splitPercentage: values.splitPercentage,
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
  createExpense: any,
  formAction?: string
) => {
  console.log("Creating new expense with values:", values);
  
  const newExpense = await createExpense.mutateAsync({
    description: values.description,
    amount: parseFloat(values.amount),
    date: format(values.date, 'yyyy-MM-dd'),
    category: values.category,
    status: 'pending',
    splitMethod: values.splitMethod,
    splitPercentage: values.splitMethod === 'custom' ? values.splitPercentage : undefined,
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
      // We'll send notification later when using Save & Share
      if (formAction !== 'saveAndShare') {
        await sendExpenseNotification({
          id: newExpense.id,
          description: values.description,
          amount: values.amount,
          date: format(values.date, 'yyyy-MM-dd'),
          category: values.category,
          splitMethod: values.splitMethod,
          splitPercentage: values.splitPercentage,
          childIds: values.childIds,
          receiptUrl: receiptUrl
        }, expenseData.approval_token, user.id);
      }
    }
  }
  
  return newExpense;
};

// Function to send expense to co-parent
const sendExpenseToCoParent = async (
  expenseId: string,
  coParentEmail: string,
  values: FormValues,
  user: any
) => {
  try {
    console.log("Sharing expense with co-parent:", coParentEmail);
    
    // This would usually call an edge function to send an email
    
    // Create a notification for the co-parent
    await supabase.from('notifications').insert({
      user_id: user.id, // This will need to be updated to the co-parent's ID in a real implementation
      type: 'expense_shared',
      message: `New expense shared: ${values.description} for $${values.amount}`,
      related_id: expenseId
    });
    
    return true;
  } catch (error) {
    console.error("Error sharing expense:", error);
    return false;
  }
};
