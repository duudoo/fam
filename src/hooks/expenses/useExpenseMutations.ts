
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Expense } from "@/utils/types";

export const useExpenseMutations = (userId?: string) => {
  const queryClient = useQueryClient();

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: async (newExpense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('expenses')
        .insert({
          description: newExpense.description,
          amount: newExpense.amount,
          date: newExpense.date,
          category: newExpense.category,
          paid_by: userId, // Always use the current user's ID
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
      queryClient.invalidateQueries({ queryKey: ['expenses', userId] });
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
      if (!userId) throw new Error("User not authenticated");

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
        .eq('paid_by', userId) // Ensure the user can only update their own expenses
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', userId] });
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
      if (!userId) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('paid_by', userId); // Ensure the user can only delete their own expenses

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', userId] });
      toast.success("Expense deleted successfully");
    },
    onError: (error) => {
      console.error('Error deleting expense:', error);
      toast.error("Failed to delete expense");
    }
  });

  return {
    createExpense: createExpenseMutation.mutate,
    updateExpense: updateExpenseMutation.mutate,
    deleteExpense: deleteExpenseMutation.mutate,
    isPending: createExpenseMutation.isPending || updateExpenseMutation.isPending || deleteExpenseMutation.isPending
  };
};
