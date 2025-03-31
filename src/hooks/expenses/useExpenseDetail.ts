
import { useState, useEffect } from "react";
import { Expense } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useExpenseDetail = (expenseId: string | undefined) => {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchExpense = async () => {
      if (!expenseId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('expenses')
          .select(`
            *,
            expense_children (
              child_id,
              expense_id
            )
          `)
          .eq('id', expenseId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Transform the data to match our Expense type
          const childIds = data.expense_children ? 
            data.expense_children.map((ec: any) => ec.child_id) : 
            [];
            
          const transformedExpense: Expense = {
            id: data.id,
            description: data.description,
            amount: data.amount,
            date: data.date,
            category: data.category,
            paidBy: data.paid_by,
            receiptUrl: data.receipt_url,
            status: data.status,
            splitMethod: data.split_method,
            splitPercentage: data.split_percentage,
            splitAmounts: data.split_amounts,
            notes: data.notes,
            disputeNotes: data.dispute_notes,
            childIds,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
          
          setExpense(transformedExpense);
        }
      } catch (err: any) {
        console.error("Error fetching expense:", err);
        setError(err.message || "Failed to load expense details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpense();
  }, [expenseId]);

  const handleDelete = async (expenseId: string) => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);
      
      if (error) throw error;
      
      toast.success("Expense deleted successfully");
      navigate('/expenses');
    } catch (err: any) {
      console.error("Error deleting expense:", err);
      toast.error("Failed to delete expense");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    expense,
    loading,
    error,
    isDeleting,
    handleDelete,
    handleStatusChange: () => {
      // This is called after status changes to potentially refresh data
      // In a more sophisticated implementation, we could refetch just the expense
    }
  };
};
