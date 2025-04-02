
import { supabase } from "@/integrations/supabase/client";
import { Expense, ExpenseStatus } from "@/utils/types";

/**
 * Create a new expense
 */
export const createExpense = async (userId: string, newExpense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
  // Start a transaction
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      description: newExpense.description,
      amount: newExpense.amount,
      date: newExpense.date,
      category: newExpense.category,
      paid_by: userId,
      receipt_url: newExpense.receiptUrl,
      status: newExpense.status,
      split_method: newExpense.splitMethod,
      split_percentage: newExpense.splitPercentage,
      split_amounts: newExpense.splitAmounts,
      notes: newExpense.notes,
      dispute_notes: newExpense.disputeNotes
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  // If there are child IDs, create expense-child relationships
  if (newExpense.childIds && newExpense.childIds.length > 0) {
    const childRelations = newExpense.childIds.map(childId => ({
      expense_id: data.id,
      child_id: childId
    }));

    const { error: relError } = await supabase
      .from('expense_children')
      .insert(childRelations);

    if (relError) {
      throw relError;
    }
  }
  
  // If it's a disputed expense, record the dispute in the status history
  if (newExpense.status === 'disputed' && newExpense.disputeNotes) {
    await recordStatusChange(data.id, 'disputed', userId, newExpense.disputeNotes);
  }
  
  return data;
};

/**
 * Update an expense
 */
export const updateExpense = async (
  expenseId: string, 
  updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>
) => {
  // Transform from our app's model to the database model
  const dbUpdates: Record<string, any> = {};
  
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
  if (updates.date !== undefined) dbUpdates.date = updates.date;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.receiptUrl !== undefined) dbUpdates.receipt_url = updates.receiptUrl;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.splitMethod !== undefined) dbUpdates.split_method = updates.splitMethod;
  if (updates.splitPercentage !== undefined) dbUpdates.split_percentage = updates.splitPercentage;
  if (updates.splitAmounts !== undefined) dbUpdates.split_amounts = updates.splitAmounts;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  if (updates.disputeNotes !== undefined) dbUpdates.dispute_notes = updates.disputeNotes;

  console.log("Updating expense with payload:", { expenseId, dbUpdates });

  const { data, error } = await supabase
    .from('expenses')
    .update(dbUpdates)
    .eq('id', expenseId)
    .select()
    .single();

  if (error) {
    console.error("Error updating expense in Supabase:", error);
    throw error;
  }
  
  // If childIds is included in the updates, update the child relationships
  if (updates.childIds !== undefined) {
    // First, remove all existing relationships
    const { error: deleteError } = await supabase
      .from('expense_children')
      .delete()
      .eq('expense_id', expenseId);
    
    if (deleteError) throw deleteError;
    
    // Then add the new relationships if there are any
    if (updates.childIds.length > 0) {
      const childRelations = updates.childIds.map(childId => ({
        expense_id: expenseId,
        child_id: childId
      }));
      
      const { error: insertError } = await supabase
        .from('expense_children')
        .insert(childRelations);
      
      if (insertError) throw insertError;
    }
  }
  
  // If it's a status change and has dispute notes, record it in history
  if (updates.status === 'disputed' && updates.disputeNotes) {
    await recordStatusChange(expenseId, 'disputed', "system", updates.disputeNotes);
  }
  
  return data;
};

/**
 * Delete an expense
 */
export const deleteExpense = async (expenseId: string) => {
  console.log("Deleting expense:", expenseId);

  // First, delete any child relationships
  const { error: childRelError } = await supabase
    .from('expense_children')
    .delete()
    .eq('expense_id', expenseId);

  if (childRelError) {
    console.error("Error deleting expense child relationships:", childRelError);
  }
  
  // Then delete the expense
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId);

  if (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
  
  // Return the ID of the deleted expense for cache updates
  return expenseId;
};

/**
 * Update expense status
 */
export const updateExpenseStatus = async (
  expenseId: string, 
  status: ExpenseStatus, 
  userId: string = "system",
  note?: string
) => {
  // Update the expense status
  const { error } = await supabase
    .from('expenses')
    .update({ 
      status,
      ...(status === 'disputed' && note ? { dispute_notes: note } : {})
    })
    .eq('id', expenseId);
    
  if (error) {
    throw error;
  }
  
  // Record the status change in history
  await recordStatusChange(expenseId, status, userId, note);
  
  return { id: expenseId, status };
};

/**
 * Record a status change in the expense history
 */
const recordStatusChange = async (
  expenseId: string,
  status: ExpenseStatus,
  userId: string,
  note?: string
) => {
  try {
    // In a production app, you would have a status_history table
    // For this implementation, we'll just log it
    console.log(`Status history: Expense ${expenseId} changed to ${status} by ${userId}${note ? ` with note: ${note}` : ''}`);
    
    // Example of how to implement with a real table:
    /*
    await supabase.from('expense_status_history').insert({
      expense_id: expenseId,
      status,
      user_id: userId,
      note,
      created_at: new Date().toISOString()
    });
    */
  } catch (error) {
    console.error('Error recording status change:', error);
    // Don't throw - this shouldn't fail the main operation
  }
};
