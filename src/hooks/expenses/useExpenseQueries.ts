
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Expense, ExpenseCategory, ExpenseStatus } from "@/utils/types";

export const useExpenseQueries = (
  userId: string | undefined,
  statusFilter: ExpenseStatus | "all" = "all",
  categoryFilter: ExpenseCategory | "all" = "all",
  searchQuery: string = ""
) => {
  const fetchExpenses = async () => {
    if (!userId) return [];

    console.log("Fetching expenses with filters:", { statusFilter, categoryFilter, searchQuery });
    
    let query = supabase
      .from('expenses')
      .select('*');
    
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
      console.error("Error fetching expenses:", error);
      throw new Error(error.message);
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
      createdAt: exp.created_at,
      updatedAt: exp.updated_at
    }));
    
    return expenses;
  };

  return useQuery({
    queryKey: ['expenses', userId, statusFilter, categoryFilter, searchQuery],
    queryFn: fetchExpenses,
    enabled: !!userId,
    initialData: [],
  });
};
