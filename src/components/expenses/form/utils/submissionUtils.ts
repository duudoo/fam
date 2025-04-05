
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
  
  // Make sure to include the split method and percentage/amounts in updates
  const updates = {
    description: values.description,
    amount: parseFloat(values.amount),
    date: format(values.date, 'yyyy-MM-dd'),
    category: values.category,
    splitMethod: values.splitMethod,
    splitPercentage: values.splitPercentage,
    splitAmounts: values.splitAmounts,
    childSplitAmounts: values.childSplitAmounts,
    notes: values.notes || undefined,
    receiptUrl: receiptUrl || undefined,
    childIds: values.childIds || []
  };
  
  console.log("Update payload:", updates);
  
  // Call the mutateAsync method with the update payload
  return await updateExpense.mutateAsync({
    id: expenseId,
    updates: updates
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
  
  // Calculate child split amounts if not provided and children are selected
  let childSplitAmounts = values.childSplitAmounts;
  
  if (values.childIds && values.childIds.length > 0 && !childSplitAmounts) {
    // Equal split among children
    const amount = parseFloat(values.amount);
    const perChildAmount = amount / values.childIds.length;
    
    childSplitAmounts = {};
    values.childIds.forEach(childId => {
      childSplitAmounts![childId] = perChildAmount;
    });
    
    console.log("Auto-calculated child split amounts:", childSplitAmounts);
  }
  
  // Ensure we're properly including the split information based on the splitMethod
  const newExpenseData = {
    description: values.description,
    amount: parseFloat(values.amount),
    date: format(values.date, 'yyyy-MM-dd'),
    category: values.category,
    status: 'pending',
    splitMethod: values.splitMethod,
    splitPercentage: values.splitMethod === 'custom' ? values.splitPercentage : undefined,
    splitAmounts: values.splitMethod === 'custom' ? values.splitAmounts : undefined,
    childSplitAmounts: childSplitAmounts,
    notes: values.notes || undefined,
    receiptUrl: receiptUrl || undefined,
    paidBy: user.id,
    childIds: values.childIds || []
  };
  
  console.log("Create expense payload:", newExpenseData);
  
  const newExpense = await createExpense.mutateAsync(newExpenseData);
  
  if (newExpense) {
    const { data: expenseData, error: expenseError } = await supabase
      .from('expenses')
      .select('id, approval_token')
      .eq('id', newExpense.id)
      .single();
      
    if (!expenseError && expenseData) {
      // We'll only send automatic email notification if not using Save & Share option
      // For Save & Share, we'll handle it separately with a dialog
      if (formAction !== 'saveAndShare') {
        await sendExpenseNotification({
          id: newExpense.id,
          description: values.description,
          amount: values.amount,
          date: format(values.date, 'yyyy-MM-dd'),
          category: values.category,
          splitMethod: values.splitMethod,
          splitPercentage: values.splitPercentage,
          childIds: values.childIds || [],
          receiptUrl: receiptUrl
        }, expenseData.approval_token, user.id);
      }
    }
  }
  
  return newExpense;
};
