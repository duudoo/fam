
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Expense, ExpenseCategory, ExpenseStatus, SplitMethod } from "@/utils/types";

export const useExpenses = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [filter, setFilter] = useState<ExpenseStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch expenses from Supabase
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses', user?.id, filter, categoryFilter, searchQuery],
    queryFn: async () => {
      if (!user) return [];

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
    enabled: !!user,
  });

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: async (newExpense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('expenses')
        .insert({
          description: newExpense.description,
          amount: newExpense.amount,
          date: newExpense.date,
          category: newExpense.category,
          paid_by: user.id, // Always use the current user's ID
          receipt_url: newExpense.receiptUrl,
          status: newExpense.status || 'pending',
          split_method: newExpense.splitMethod,
          notes: newExpense.notes
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', user?.id] });
      toast.success("Expense added successfully");
    },
    onError: (error) => {
      console.error('Error creating expense:', error);
      toast.error("Failed to add expense");
    }
  });

  // Update expense mutation
  const updateExpenseMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Expense> & { id: string }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('expenses')
        .update({
          description: updates.description,
          amount: updates.amount,
          date: updates.date,
          category: updates.category,
          receipt_url: updates.receiptUrl,
          status: updates.status,
          split_method: updates.splitMethod,
          notes: updates.notes
        })
        .eq('id', id)
        .eq('paid_by', user.id) // Ensure the user can only update their own expenses
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', user?.id] });
      toast.success("Expense updated successfully");
    },
    onError: (error) => {
      console.error('Error updating expense:', error);
      toast.error("Failed to update expense");
    }
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('paid_by', user.id); // Ensure the user can only delete their own expenses

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', user?.id] });
      toast.success("Expense deleted successfully");
    },
    onError: (error) => {
      console.error('Error deleting expense:', error);
      toast.error("Failed to delete expense");
    }
  });

  // Set up real-time subscription to expenses
  const subscribeToExpenses = () => {
    if (!user) return null;

    const channel = supabase
      .channel('expenses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: `paid_by=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['expenses', user?.id] });
        }
      )
      .subscribe();

    return channel;
  };

  return {
    expenses,
    isLoading,
    filter,
    setFilter,
    categoryFilter, 
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    createExpense: createExpenseMutation.mutate,
    updateExpense: updateExpenseMutation.mutate,
    deleteExpense: deleteExpenseMutation.mutate,
    isPending: createExpenseMutation.isPending || updateExpenseMutation.isPending || deleteExpenseMutation.isPending,
    subscribeToExpenses
  };
};
