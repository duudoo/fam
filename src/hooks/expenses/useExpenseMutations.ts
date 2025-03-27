
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Expense, ExpenseStatus } from "@/utils/types";

export const useExpenseMutations = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  // Create a new expense
  const createExpense = useMutation({
    mutationFn: async (newExpense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!userId) throw new Error("User not authenticated");

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

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Expense created successfully");
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      console.error("Error creating expense:", error);
      toast.error("Failed to create expense");
    }
  });

  // Update an existing expense
  const updateExpense = useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string, 
      updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>> 
    }) => {
      if (!userId) throw new Error("User not authenticated");

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
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Expense updated successfully");
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense");
    }
  });

  // Delete an expense
  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      toast.success("Expense deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  });

  return {
    createExpense,
    updateExpense,
    deleteExpense,
    isPending: createExpense.isPending || updateExpense.isPending || deleteExpense.isPending
  };
};
