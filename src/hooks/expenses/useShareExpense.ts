
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Expense } from "@/utils/types";

interface UseShareExpenseProps {
  expense: Expense | null;
  expenseLink: string;
  onSuccess?: () => void;
}

export const useShareExpense = ({ 
  expense, 
  expenseLink,
  onSuccess 
}: UseShareExpenseProps) => {
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  
  const shareViaMessage = async (message: string) => {
    if (!user || !expense) {
      toast.error("Unable to share expense");
      return;
    }
    
    try {
      setIsSending(true);
      
      // Get co-parents that are associated with the expense's children
      const { data: childParents, error: parentsError } = await supabase
        .from('parent_children')
        .select(`
          parent_id,
          child_id
        `)
        .in('child_id', expense.childIds || [])
        .neq('parent_id', user.id);
        
      if (parentsError) throw parentsError;
      
      if (childParents.length === 0) {
        throw new Error("No co-parents found for the selected children");
      }
      
      // Get unique co-parent IDs
      const coParentIds = Array.from(new Set(childParents.map(cp => cp.parent_id)));
      
      // For each co-parent, create a conversation if needed and send a message
      for (const coParentId of coParentIds) {
        // Check if there's an existing conversation
        const { data: conversations, error: convError } = await supabase
          .from('conversations')
          .select('id')
          .contains('participants', [user.id, coParentId])
          .limit(1);
          
        if (convError) throw convError;
        
        let conversationId;
        
        if (conversations && conversations.length > 0) {
          conversationId = conversations[0].id;
        } else {
          // Create a new conversation
          const { data: newConv, error: newConvError } = await supabase
            .from('conversations')
            .insert({
              participants: [user.id, coParentId]
            })
            .select('id')
            .single();
            
          if (newConvError) throw newConvError;
          conversationId = newConv.id;
        }
        
        // Send the message
        const messageText = `${message ? message + '\n\n' : ''}I've shared an expense: "${expense.description}" for $${expense.amount}\n${expenseLink}`;
        
        const { error: msgError } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            receiver_id: coParentId,
            text: messageText,
            status: 'sent'
          });
          
        if (msgError) throw msgError;
      }
      
      toast.success("Expense shared successfully");
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error sharing expense:", error);
      toast.error(error instanceof Error ? error.message : "Failed to share expense");
    } finally {
      setIsSending(false);
    }
  };
  
  return {
    isSending,
    shareViaMessage
  };
};
