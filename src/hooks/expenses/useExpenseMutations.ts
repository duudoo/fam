
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Expense, ExpenseStatus } from "@/utils/types";
import { expensesAPI } from "@/lib/api/expenses";

export const useExpenseMutations = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  // Create a new expense
  const createExpense = useMutation({
    mutationFn: async (newExpense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!userId) throw new Error("User not authenticated");
      return await expensesAPI.createExpense(userId, newExpense);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success("Expense created successfully");
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
      return await expensesAPI.updateExpense(id, updates, userId);
    },
    onSuccess: (updatedExpense) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success("Expense updated successfully");
      
      // If expense status was updated to "disputed", show a different toast
      if (updatedExpense.status === 'disputed') {
        toast.info("Expense marked for clarification");
      }
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
      return await expensesAPI.deleteExpense(id, userId);
    },
    onSuccess: (deletedId) => {
      // Make sure to update the cache to remove the deleted expense
      queryClient.setQueryData(['expenses'], (oldData: Expense[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(expense => expense.id !== deletedId);
      });
      
      // Also invalidate the expenses query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      
      toast.success("Expense deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  });
  
  // Update expense status
  const updateExpenseStatus = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      note 
    }: { 
      id: string, 
      status: ExpenseStatus, 
      note?: string 
    }) => {
      if (!userId) throw new Error("User not authenticated");
      return await expensesAPI.updateExpenseStatus(id, status, userId, note);
    },
    onSuccess: ({ status }) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      
      let message = "Expense status updated";
      if (status === 'approved') message = "Expense approved";
      if (status === 'disputed') message = "Expense sent for clarification";
      if (status === 'paid') message = "Expense marked as paid";
      
      toast.success(message);
    },
    onError: (error) => {
      console.error("Error updating expense status:", error);
      toast.error("Failed to update expense status");
    }
  });

  return {
    createExpense,
    updateExpense,
    deleteExpense,
    updateExpenseStatus,
    isPending: createExpense.isPending || updateExpense.isPending || deleteExpense.isPending || updateExpenseStatus.isPending
  };
};
