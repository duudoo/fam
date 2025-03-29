import { supabase } from "@/integrations/supabase/client";
import { Expense, ExpenseCategory, ExpenseStatus } from "@/utils/types";

export const expensesAPI = {
  /**
   * Fetch expenses with optional filters
   */
  getExpenses: async (
    userId: string,
    statusFilter: ExpenseStatus | "all" = "all",
    categoryFilter: ExpenseCategory | "all" = "all",
    searchQuery: string = ""
  ) => {
    let query = supabase
      .from('expenses')
      .select(`
        *,
        expense_children (
          child_id
        )
      `);
    
    // Add status filter if not "all"
    if (statusFilter !== "all") {
      query = query.eq('status', statusFilter);
    }
    
    // Add category filter if not "all"
    if (categoryFilter !== "all") {
      query = query.eq('category', categoryFilter);
    }
    
    // Add search filter if provided
    if (searchQuery) {
      query = query.ilike('description', `%${searchQuery}%`);
    }

    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transform database expenses to match the Expense type
    const expenses: Expense[] = data.map(exp => ({
      id: exp.id,
      description: exp.description,
      amount: exp.amount,
      date: exp.date,
      category: exp.category as ExpenseCategory,
      paidBy: exp.paid_by,
      receiptUrl: exp.receipt_url || undefined,
      status: exp.status as ExpenseStatus,
      splitMethod: exp.split_method,
      notes: exp.notes || undefined,
      childIds: exp.expense_children ? exp.expense_children.map((ec: any) => ec.child_id) : undefined,
      createdAt: exp.created_at,
      updatedAt: exp.updated_at
    }));
    
    return expenses;
  },

  /**
   * Create a new expense
   */
  createExpense: async (userId: string, newExpense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
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
        notes: newExpense.notes
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
    
    return data;
  },

  /**
   * Update an expense
   */
  updateExpense: async (
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
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    const { data, error } = await supabase
      .from('expenses')
      .update(dbUpdates)
      .eq('id', expenseId)
      .select()
      .single();

    if (error) {
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
    
    return data;
  },

  /**
   * Delete an expense
   */
  deleteExpense: async (expenseId: string) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);

    if (error) {
      throw error;
    }
    
    return expenseId;
  },

  /**
   * Update expense status
   */
  updateExpenseStatus: async (expenseId: string, status: ExpenseStatus) => {
    const { error } = await supabase
      .from('expenses')
      .update({ status })
      .eq('id', expenseId);
      
    if (error) {
      throw error;
    }
    
    return { id: expenseId, status };
  },

  /**
   * Subscribe to expense changes
   */
  subscribeToExpenses: (callback: Function) => {
    const channel = supabase
      .channel('expenses-subscription')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return channel;
  }
};
