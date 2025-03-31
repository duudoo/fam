
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { expensesAPI } from "@/lib/api/expenses";
import { ExpenseStatus } from "@/utils/types";

interface UseExpenseStatusProps {
  expenseId: string;
  userId: string | undefined;
  onSuccess?: () => void;
}

export const useExpenseStatus = ({ 
  expenseId, 
  userId, 
  onSuccess 
}: UseExpenseStatusProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const updateStatus = async (status: ExpenseStatus, note?: string) => {
    if (!userId) return;
    
    setIsProcessing(true);
    try {
      await expensesAPI.updateExpenseStatus(expenseId, status, userId, note);
      
      let message = "";
      switch (status) {
        case 'approved':
          message = "Expense approved";
          break;
        case 'disputed':
          message = "Expense disputed";
          break;
        case 'paid':
          message = "Expense marked as paid";
          break;
        case 'pending':
          message = "Expense marked as pending";
          break;
      }
      
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating expense status:', error);
      toast.error('Failed to update expense status');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    updateStatus
  };
};
