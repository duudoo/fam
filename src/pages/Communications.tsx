
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { MessageConversation } from "@/components/communication/MessageConversation";
import { MessageInput } from "@/components/communication/MessageInput";
import { ConversationHeader } from "@/components/communication/ConversationHeader";
import { Message, Expense } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import ExpenseDetailDialog from "@/components/expenses/ExpenseDetailDialog";

const CommunicationsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [currentReceiverId, setCurrentReceiverId] = useState<string | null>("Sarah"); // Hardcoded for demo
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  // Use the new message subscription hook for real-time updates
  useMessageSubscription(user?.id, currentReceiverId);
  
  // Fetch messages for the current conversation
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', currentReceiverId],
    queryFn: async () => {
      if (!currentReceiverId || !user) return [];
      
      try {
        const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('timestamp', { ascending: true });

        if (error) throw error;
        
        return messages.map(msg => {
          // Parse attachments if any
          const attachments = msg.attachments || [];
          
          return {
            id: msg.id,
            senderId: msg.sender_id === user.id ? "user" : "Sarah",
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
    enabled: !!currentReceiverId && !!user
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
        // Transform the data to match the Expense type
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

  // Render an expense attachment in the message
  const renderExpenseAttachment = (attachment: any) => {
    if (attachment.type === 'expense_reference' && attachment.expenseId) {
      const { expenseInfo } = attachment;
      
      // Format the expense amount
      const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(expenseInfo?.amount || 0);
      
      // Format the date
      const formattedDate = expenseInfo?.date ? 
        new Date(expenseInfo.date).toLocaleDateString() : 
        'Unknown date';
      
      return (
        <div 
          className="mt-2 p-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleExpenseClick(attachment.expenseId)}
        >
          <div className="font-semibold mb-1">Expense Reference:</div>
          <div className="text-sm">
            <div><span className="font-medium">Description:</span> {expenseInfo?.description || 'N/A'}</div>
            <div><span className="font-medium">Amount:</span> {formattedAmount}</div>
            <div><span className="font-medium">Date:</span> {formattedDate}</div>
            <div><span className="font-medium">Category:</span> {expenseInfo?.category || 'N/A'}</div>
          </div>
          <div className="mt-2">
            <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Click to view full details
            </span>
          </div>
        </div>
      );
    }
    return null;
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
      
      // Optimistically add message to UI
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

  // Go to expense detail page
  const handleViewExpenseDetail = () => {
    if (selectedExpense) {
      navigate(`/expenses/${selectedExpense.id}`);
    }
    setDetailDialogOpen(false);
  };

  // Update the MessageConversation component to render expense attachments
  const MessageConversationWithAttachments = ({ messages }: { messages: Message[] }) => {
    return (
      <div className="space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[70%] p-3 rounded-lg ${
                message.senderId === "user" 
                  ? "bg-famacle-blue text-white rounded-tr-none" 
                  : "bg-gray-200 text-gray-800 rounded-tl-none"
              }`}
            >
              <div className="mb-1">{message.text}</div>
              
              {/* Render expense attachments if any */}
              {message.attachments?.map((attachment, index) => (
                <div key={index} className={`mt-2 ${message.senderId === "user" ? "text-white" : "text-gray-800"}`}>
                  {renderExpenseAttachment(attachment)}
                </div>
              ))}
              
              <div className={`text-xs mt-1 ${message.senderId === "user" ? "text-blue-100" : "text-gray-500"}`}>
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-famacle-blue-light/30">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-famacle-slate mb-2">Communications</h1>
            <p className="text-gray-600">Keep all your co-parenting conversations organized and constructive</p>
          </div>
        </header>
        
        <Card className="p-6 shadow-lg border border-gray-100 relative">
          <ConversationHeader recipient="Sarah Johnson" />

          <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto mb-4 pr-2">
              {authLoading || isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading messages...</p>
                </div>
              ) : (
                <MessageConversationWithAttachments messages={messages} />
              )}
            </div>
            
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </Card>
      </main>
      
      {/* Expense Detail Dialog */}
      {selectedExpense && (
        <ExpenseDetailDialog
          expense={selectedExpense}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          onEdit={handleViewExpenseDetail}
        />
      )}
    </div>
  );
};

export default CommunicationsPage;
