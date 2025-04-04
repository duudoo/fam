
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
        
      if (parentsError) {
        console.error("Error fetching child parents:", parentsError);
        throw new Error("Failed to find co-parents");
      }
      
      // Get a list of co-parent IDs (can be empty if there are no co-parents yet)
      const coParentIds = Array.from(new Set(childParents.map(cp => cp.parent_id)));
      
      // If there are co-parents, send messages to them
      if (coParentIds.length > 0) {
        // For each co-parent, create a conversation if needed and send a message
        for (const coParentId of coParentIds) {
          await sendMessageToCoParent(coParentId, message, expense, expenseLink, user.id);
        }
      } else {
        // Even if there are no co-parents, we still want to create a placeholder conversation
        // so the expense can be found in the Communications tab
        await createPlaceholderConversation(message, expense, expenseLink, user.id);
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

  // Helper to send a message to a specific co-parent
  const sendMessageToCoParent = async (
    coParentId: string, 
    message: string, 
    expense: Expense, 
    expenseLink: string,
    userId: string
  ) => {
    // Check if there's an existing conversation
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .contains('participants', [userId, coParentId])
      .limit(1);
      
    if (convError) {
      console.error("Error fetching conversations:", convError);
      throw convError;
    }
    
    let conversationId;
    
    if (conversations && conversations.length > 0) {
      conversationId = conversations[0].id;
    } else {
      // Create a new conversation
      const { data: newConv, error: newConvError } = await supabase
        .from('conversations')
        .insert({
          participants: [userId, coParentId]
        })
        .select('id')
        .single();
        
      if (newConvError) {
        console.error("Error creating new conversation:", newConvError);
        throw newConvError;
      }
      
      conversationId = newConv.id;
    }
    
    // Send the message
    const messageText = `${message ? message + '\n\n' : ''}I've shared an expense: "${expense.description}" for $${expense.amount}\n${expenseLink}`;
    
    const { error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        receiver_id: coParentId,
        text: messageText,
        status: 'sent',
        attachments: [{
          type: 'expense_reference',
          expenseId: expense.id,
          expenseInfo: {
            description: expense.description,
            amount: expense.amount,
            date: expense.date,
            category: expense.category
          }
        }]
      });
      
    if (msgError) {
      console.error("Error sending message:", msgError);
      throw msgError;
    }
  };

  // Helper to create a placeholder conversation when no co-parent exists yet
  const createPlaceholderConversation = async (
    message: string, 
    expense: Expense, 
    expenseLink: string,
    userId: string
  ) => {
    // Find the placeholder conversation for just this user
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .contains('participants', [userId])
      .eq('participants', [userId].length)  // Only where this user is the sole participant
      .limit(1);
      
    if (convError) {
      console.error("Error fetching placeholder conversation:", convError);
      throw convError;
    }
    
    let conversationId;
    
    if (conversations && conversations.length > 0) {
      conversationId = conversations[0].id;
    } else {
      // Create a new placeholder conversation with just this user
      const { data: newConv, error: newConvError } = await supabase
        .from('conversations')
        .insert({
          participants: [userId]
        })
        .select('id')
        .single();
        
      if (newConvError) {
        console.error("Error creating placeholder conversation:", newConvError);
        throw newConvError;
      }
      
      conversationId = newConv.id;
    }
    
    // Store the expense info in a message for future reference
    const messageText = `${message ? message + '\n\n' : ''}Expense saved: "${expense.description}" for $${expense.amount}\n${expenseLink}\n\n(This expense will be shared with co-parents once they are added to your family circle)`;
    
    const { error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        receiver_id: userId, // Self-message as placeholder
        text: messageText,
        status: 'sent',
        attachments: [{
          type: 'expense_reference',
          expenseId: expense.id,
          expenseInfo: {
            description: expense.description,
            amount: expense.amount,
            date: expense.date,
            category: expense.category
          }
        }]
      });
      
    if (msgError) {
      console.error("Error saving expense message:", msgError);
      throw msgError;
    }
    
    // Also create a notification that the expense is ready to be shared
    const { error: notifError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        related_id: expense.id,
        type: 'expense_shared',
        message: `Expense "${expense.description}" has been saved and is ready to share with co-parents once they're added.`,
      });
      
    if (notifError) {
      console.error("Error creating notification:", notifError);
      // Don't throw here, just log error
    }
  };
  
  return {
    isSending,
    shareViaMessage
  };
};
