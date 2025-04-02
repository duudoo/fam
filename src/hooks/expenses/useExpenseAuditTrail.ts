
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ExpenseStatus } from "@/utils/types";

interface AuditTrailEntry {
  id: string;
  expenseId: string;
  status: ExpenseStatus;
  userId: string;
  timestamp: string;
  note?: string;
}

export const useExpenseAuditTrail = (expenseId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Get audit trail entries for an expense
  const { data: auditTrail, isLoading } = useQuery({
    queryKey: ['expense-audit-trail', expenseId],
    queryFn: async () => {
      if (!expenseId) return [];
      
      // For now, we are mocking this functionality since there's no actual
      // audit trail table implemented in Supabase yet.
      // This would be replaced with an actual query in a production app
      
      // Mock data
      const mockAuditTrail: AuditTrailEntry[] = [
        {
          id: "1",
          expenseId,
          status: "pending",
          userId: user?.id || "",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          note: "Expense created"
        }
      ];
      
      // If the expense has a dispute_notes field, add an entry for it
      const { data: expense, error } = await supabase
        .from('expenses')
        .select('status, dispute_notes')
        .eq('id', expenseId)
        .single();
        
      if (!error && expense && expense.status === 'disputed' && expense.dispute_notes) {
        mockAuditTrail.push({
          id: "2",
          expenseId,
          status: "disputed",
          userId: user?.id || "",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          note: expense.dispute_notes
        });
      }
      
      return mockAuditTrail;
    },
    enabled: !!expenseId && !!user,
  });
  
  // Record a new audit trail entry
  const recordAuditEntry = useMutation({
    mutationFn: async ({ 
      status, 
      note 
    }: { 
      status: ExpenseStatus, 
      note?: string 
    }) => {
      if (!expenseId || !user) throw new Error("Missing expense ID or user");
      
      // In a production app, this would insert a record into an audit_trail table
      console.log(`Recording audit entry: Expense ${expenseId} changed to ${status} with note: ${note}`);
      
      // For now, we'll just return a mock entry
      return {
        id: Date.now().toString(),
        expenseId,
        status,
        userId: user.id,
        timestamp: new Date().toISOString(),
        note
      };
    },
    onSuccess: (newEntry) => {
      // Update the cache with the new entry
      queryClient.setQueryData(['expense-audit-trail', expenseId], (old: AuditTrailEntry[] = []) => {
        return [...old, newEntry];
      });
    },
    onError: (error) => {
      console.error("Error recording audit entry:", error);
      toast.error("Failed to record expense status change");
    }
  });
  
  return {
    auditTrail,
    isLoading,
    recordAuditEntry
  };
};
