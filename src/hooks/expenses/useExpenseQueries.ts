
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Expense, ExpenseCategory, ExpenseStatus, SplitMethod } from "@/utils/types";

export const useExpenseQueries = (
  userId?: string,
  filter: ExpenseStatus | "all" = "all",
  categoryFilter: ExpenseCategory | "all" = "all",
  searchQuery: string = ""
) => {
  // Fetch expenses from Supabase
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses', userId, filter, categoryFilter, searchQuery],
    queryFn: async () => {
      if (!userId) return [];

      let query = supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply status filter
      if (filter !== "all") {
        query = query.eq('status', filter);
      }

      // Apply category filter
      if (categoryFilter !== "all") {
        query = query.eq('category', categoryFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching expenses:', error);
        toast.error("Failed to load expenses");
        throw error;
      }

      // Apply search filter client-side
      let filteredData = data || [];
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredData = filteredData.filter(expense => 
          expense.description.toLowerCase().includes(query) ||
          expense.notes?.toLowerCase().includes(query)
        );
      }

      return filteredData.map(expense => ({
        id: expense.id,
        description: expense.description,
        amount: parseFloat(expense.amount),
        date: expense.date,
        category: expense.category as ExpenseCategory,
        paidBy: expense.paid_by,
        receiptUrl: expense.receipt_url || undefined,
        status: expense.status as ExpenseStatus,
        splitMethod: expense.split_method as SplitMethod,
        notes: expense.notes || undefined,
        createdAt: expense.created_at,
        updatedAt: expense.updated_at
      }));
    },
    enabled: !!userId,
  });

  return {
    expenses,
    isLoading
  };
};
