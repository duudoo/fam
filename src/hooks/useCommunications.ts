import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message, Expense, CoParentInvite } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";
import { toast } from "sonner";

export const useCommunications = (initialReceiverId: string = "") => {
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  const [currentReceiverId, setCurrentReceiverId] = useState<string | null>(initialReceiverId);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [coParentInfo, setCoParentInfo] = useState<{ 
    name: string, 
    status: string,
    email?: string
  }>({ 
    name: "Invited Co-Parent", 
    status: "pending" 
  });
  
  // Fetch co-parent invites when user changes
  useEffect(() => {
    if (user) {
      fetchCoParentInfo();
    }
  }, [user]);

  const fetchCoParentInfo = async () => {
    try {
      if (!user) return;
      
      const { data: invites, error } = await supabase
        .from('co_parent_invites')
        .select('email, status')
        .eq('invited_by', user.id)
        .limit(1);
        
      if (error) {
        console.error('Error fetching co-parent invites:', error);
        return;
      }
      
      if (invites && invites.length > 0) {
        const invite = invites[0];
        
        if (invite.status === 'accepted') {
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, full_name')
            .eq('email', invite.email)
            .limit(1);
            
          if (!profileError && profiles && profiles.length > 0) {
            const displayName = profiles[0].first_name || profiles[0].full_name || invite.email;
            
            setCoParentInfo({
              name: displayName,
              status: invite.status,
              email: invite.email
            });
            return;
          }
        }
        
        setCoParentInfo({
          name: invite.email,
          status: invite.status,
          email: invite.email
        });
      }
    } catch (error) {
      console.error('Error fetching co-parent info:', error);
    }
  };
  
  // Use the message subscription hook for real-time updates
  useMessageSubscription(user?.id, currentReceiverId);
  
  // Fetch messages for the current conversation
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', currentReceiverId],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('timestamp', { ascending: true });

        if (error) throw error;
        
        return messages.map(msg => {
          const attachments = msg.attachments || [];
          
          return {
            id: msg.id,
            senderId: msg.sender_id === user.id ? "user" : "coparent",
            text: msg.text,
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            status: msg.status,
            attachments: attachments
          };
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
    },
    enabled: !!user
  });

  // Fetch expense details when an expense is selected
  const handleExpenseClick = async (expenseId: string) => {
    if (!user || !expenseId) return;
    
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', expenseId)
        .single();
      
      if (error) {
        console.error('Error fetching expense:', error);
        toast.error('Failed to load expense details');
        return;
      }
      
      if (data) {
        const expense: Expense = {
          id: data.id,
          description: data.description,
          amount: data.amount,
          date: data.date,
          category: data.category,
          paidBy: data.paid_by,
          receiptUrl: data.receipt_url || undefined,
          status: data.status,
          splitMethod: data.split_method,
          splitPercentage: data.split_percentage,
          notes: data.notes || undefined,
          disputeNotes: data.dispute_notes || undefined,
          childIds: [],
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        setSelectedExpense(expense);
        setDetailDialogOpen(true);
      }
    } catch (error) {
      console.error('Error handling expense click:', error);
      toast.error('Failed to fetch expense details');
    }
  };

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (newMsg: Omit<Message, "id" | "status">) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: currentReceiverId,
          text: newMsg.text,
          attachments: newMsg.attachments
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', currentReceiverId] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please try again.");
    }
  });

  const handleSendMessage = async (newMsg: Omit<Message, "id" | "status">) => {
    if (!currentReceiverId) {
      toast.error("No recipient selected");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to send messages");
      return;
    }
    
    try {
      await sendMessageMutation.mutateAsync(newMsg);
      
      queryClient.setQueryData(['messages', currentReceiverId], (oldData: Message[] = []) => {
        return [
          ...oldData,
          {
            id: `temp-${Date.now()}`,
            senderId: "user",
            text: newMsg.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sending',
            attachments: newMsg.attachments
          }
        ];
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    messages,
    isLoading,
    authLoading,
    currentReceiverId,
    selectedExpense,
    detailDialogOpen,
    setDetailDialogOpen,
    handleExpenseClick,
    handleSendMessage,
    setSelectedExpense,
    coParentInfo
  };
};
