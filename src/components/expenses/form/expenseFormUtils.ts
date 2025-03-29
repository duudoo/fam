import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { toast } from 'sonner';
import { FormValues } from './schema';

export const sendExpenseNotification = async (expenseData: any, approvalToken: string, userId: string | undefined) => {
  try {
    const { data: parentChildren, error: pcError } = await supabase
      .from('parent_children')
      .select(`
        child_id,
        parent_id
      `)
      .in('child_id', expenseData.childIds || []);
    
    if (pcError) throw pcError;
    
    const childParents = parentChildren.reduce((acc, pc) => {
      if (!acc[pc.child_id]) acc[pc.child_id] = [];
      if (pc.parent_id !== userId) acc[pc.child_id].push(pc.parent_id);
      return acc;
    }, {} as Record<string, string[]>);
    
    const coParentIds = Array.from(
      new Set(
        Object.values(childParents).flat()
      )
    );
    
    if (coParentIds.length === 0) {
      console.log("No co-parents found to notify");
      return;
    }
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .in('id', coParentIds);
    
    if (profilesError) throw profilesError;
    
    const { data: currentProfile, error: currentProfileError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();
    
    if (currentProfileError) throw currentProfileError;
    
    const formattedDate = format(new Date(expenseData.date), 'MMM d, yyyy');
    const frontendUrl = window.location.origin;
    
    const totalAmount = parseFloat(expenseData.amount);
    const splitMethod = expenseData.splitMethod;
    
    let splitAmounts: Record<string, number> = {};
    
    splitAmounts[userId || ''] = totalAmount;
    
    if (splitMethod === '50/50' && coParentIds.length > 0) {
      const amountPerParent = totalAmount / 2;
      splitAmounts[userId || ''] = amountPerParent;
      
      coParentIds.forEach(coParentId => {
        splitAmounts[coParentId] = amountPerParent;
      });
    }
    
    const { error: splitError } = await supabase
      .from('expenses')
      .update({ split_amounts: splitAmounts })
      .eq('id', expenseData.id);
      
    if (splitError) {
      console.error("Error updating split amounts:", splitError);
    }
    
    const notificationPromises = profiles.map(async (profile) => {
      const coParentAmount = splitAmounts[profile.id] || 0;
      
      const { data: notification, error: notifError } = await supabase
        .from('expense_notifications')
        .insert({
          expense_id: expenseData.id,
          sent_to: profile.email,
          token: approvalToken,
          notification_type: 'expense_approval',
          amount: coParentAmount
        })
        .select()
        .single();
      
      if (notifError) throw notifError;
      
      const approveUrl = `${frontendUrl}/api/expense-action?token=${approvalToken}&action=approve`;
      const clarifyUrl = `${frontendUrl}/api/expense-action?token=${approvalToken}&action=clarify`;
      
      await supabase.functions.invoke('send-expense-notification', {
        body: {
          expenseId: expenseData.id,
          recipientEmail: profile.email,
          expenseAmount: parseFloat(expenseData.amount),
          expenseDescription: expenseData.description,
          recipientAmount: coParentAmount,
          category: expenseData.category,
          date: formattedDate,
          payerName: currentProfile.full_name || "A co-parent",
          receiptUrl: expenseData.receiptUrl,
          approvalToken,
          approveUrl,
          clarifyUrl
        }
      });
      
      console.log(`Notification sent to ${profile.email} with amount ${coParentAmount}`);
    });
    
    await Promise.all(notificationPromises);
    toast.success("Expense notifications sent to co-parents");
  } catch (error) {
    console.error("Failed to send expense notification:", error);
    toast.error("Failed to send notifications. Co-parents will still see the expense in the app.");
  }
};

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
      const updatedExpense = await updateExpense.mutateAsync({
        id: expense.id,
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
    } else {
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
