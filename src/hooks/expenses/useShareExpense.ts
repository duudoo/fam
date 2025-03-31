import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Expense } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";

interface UseShareExpenseProps {
  expense: Expense | null;
  expenseLink: string;
  onSuccess?: () => void;
}

export const useShareExpense = ({ expense, expenseLink, onSuccess }: UseShareExpenseProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  
  // Handle sharing the expense via the messaging system
  const shareViaMessage = async (message: string) => {
    if (!expense || !user) {
      toast.error("Cannot share expense: missing data");
      return;
    }
    
    setIsSending(true);
    
    try {
      // The current user is always the sender
      const senderId = user.id;
      
      // For the demo we'll use a valid UUID as the co-parent ID
      // In a real app, this would come from a database query of co-parent relationships
      const coParentId = "02430ec4-1ae7-4b48-9a01-249b5839e461";
      
      // Determine if current user is the expense creator (paidBy)
      const isCurrentUserCreator = expense.paidBy === user.id;
      
      // If current user created the expense, send to co-parent
      // Otherwise, send to the expense creator
      const receiverId = isCurrentUserCreator ? coParentId : expense.paidBy;
      
      console.log("Sending message from", senderId, "to", receiverId);
      
      // Format message text
      const messageText = message || 
        `I've shared an expense with you: ${expense.description} for ${expense.amount}`;
      
      // Add a message to the messages table with correctly formatted data
      const { error } = await supabase.from('messages').insert({
        sender_id: senderId,
        receiver_id: receiverId,
        text: messageText,
        attachments: [
          {
            type: "link",
            url: expenseLink,
            name: `Expense: ${expense.description}`,
            id: `${Date.now()}-expense-attachment` // Add a unique ID for the attachment
          }
        ],
        status: 'sent'
      });
      
      if (error) {
        console.error("Supabase error when sharing expense:", error);
        throw error;
      }
      
      toast.success("Expense shared successfully via message");
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Navigate to the communications page to see the message
      navigate("/communications");
    } catch (error) {
      console.error("Error sharing expense via message:", error);
      toast.error("Failed to share expense");
    } finally {
      setIsSending(false);
    }
  };
  
  return {
    isSending,
    shareViaMessage
  };
};
