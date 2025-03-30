
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { toast } from 'sonner';

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
    
    const splitAmounts = await calculateSplitAmounts(expenseData, userId, coParentIds);
    
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

// Helper function to calculate split amounts based on split method
const calculateSplitAmounts = async (expenseData: any, userId: string | undefined, coParentIds: string[]) => {
  const totalAmount = parseFloat(expenseData.amount);
  const splitMethod = expenseData.splitMethod;
  
  let splitAmounts: Record<string, number> = {};
  
  console.log(`Calculating split amounts for method: ${splitMethod}`);
  
  if (splitMethod === 'none') {
    // If split method is 'none', all expense goes to the person who paid
    splitAmounts[userId || ''] = totalAmount;
    
    // Co-parents pay nothing
    coParentIds.forEach(coParentId => {
      splitAmounts[coParentId] = 0;
    });
  } 
  else if (splitMethod === '50/50' && coParentIds.length > 0) {
    // If split method is '50/50', split evenly between payer and co-parents
    const amountPerParent = totalAmount / 2;
    splitAmounts[userId || ''] = amountPerParent;
    
    // Split the other half between all co-parents (usually just one)
    const coParentAmount = amountPerParent / coParentIds.length;
    coParentIds.forEach(coParentId => {
      splitAmounts[coParentId] = coParentAmount;
    });
  }
  else if (splitMethod === 'custom' && expenseData.splitPercentage && coParentIds.length > 0) {
    // If split method is 'custom', use the provided split percentages
    const userPercentage = expenseData.splitPercentage[userId || ''] || 0;
    const coParentPercentage = 100 - userPercentage;
    
    splitAmounts[userId || ''] = (userPercentage / 100) * totalAmount;
    
    // Split the co-parent percentage between all co-parents (usually just one)
    const coParentAmount = (coParentPercentage / 100) * totalAmount / coParentIds.length;
    coParentIds.forEach(coParentId => {
      splitAmounts[coParentId] = coParentAmount;
    });
  } 
  else {
    // Default fallback to the user paying everything
    splitAmounts[userId || ''] = totalAmount;
  }
  
  console.log("Calculated split amounts:", splitAmounts);
  
  // Update the expense with the calculated split amounts
  const { error: splitError } = await supabase
    .from('expenses')
    .update({ split_amounts: splitAmounts })
    .eq('id', expenseData.id);
    
  if (splitError) {
    console.error("Error updating split amounts:", splitError);
  }
  
  return splitAmounts;
};
