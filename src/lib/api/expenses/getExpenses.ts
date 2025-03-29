
import { supabase } from "@/integrations/supabase/client";
import { Expense, ExpenseCategory, ExpenseStatus } from "@/utils/types";

/**
 * Fetch expenses with optional filters
 */
export const getExpenses = async (
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
};
