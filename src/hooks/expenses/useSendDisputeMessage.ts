
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Expense } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";

interface UseSendDisputeMessageProps {
  onSuccess?: () => void;
}

export const useSendDisputeMessage = ({ onSuccess }: UseSendDisputeMessageProps = {}) => {
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  
  const sendDisputeMessage = async (expense: Expense, disputeNote: string) => {
    if (!user || !expense) {
      toast.error("Unable to send dispute message");
      return;
    }
    
    try {
      setIsSending(true);
      
      // Get the expense creator (if different from current user)
      const expenseCreatorId = expense.paidBy;
      if (expenseCreatorId === user.id) {
        // Skip sending a message if the user is disputing their own expense
        toast.success("Expense disputed successfully");
        if (onSuccess) onSuccess();
        return;
      }
      
      // Check if there's an existing conversation
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .contains('participants', [user.id, expenseCreatorId])
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
            participants: [user.id, expenseCreatorId]
          })
          .select('id')
          .single();
          
        if (newConvError) throw newConvError;
        conversationId = newConv.id;
      }
      
      // Format currency amount for better readability
      const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(expense.amount);
      
      // Create a detailed message with expense information
      const messageText = `I've requested clarification on expense "${expense.description}" for ${formattedAmount} (${expense.category}) dated ${new Date(expense.date).toLocaleDateString()}:\n\n${disputeNote}`;
      
      // Include expense ID in a structured format for potential linking
      const attachmentData = {
        type: 'expense_reference',
        expenseId: expense.id,
        expenseInfo: {
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          category: expense.category
        }
      };
      
      // Send the dispute message
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          receiver_id: expenseCreatorId,
          text: messageText,
          status: 'sent',
          attachments: [attachmentData]
        });
        
      if (msgError) throw msgError;
      
      toast.success("Dispute message sent successfully");
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error sending dispute message:", error);
      toast.error("Failed to send dispute message");
    } finally {
      setIsSending(false);
    }
  };
  
  return {
    isSending,
    sendDisputeMessage
  };
};
