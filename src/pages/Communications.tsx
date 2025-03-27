
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { MessageConversation } from "@/components/communication/MessageConversation";
import { MessageInput } from "@/components/communication/MessageInput";
import { ConversationHeader } from "@/components/communication/ConversationHeader";
import { Message } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";
import { toast } from "sonner";

const CommunicationsPage = () => {
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  const [currentReceiverId, setCurrentReceiverId] = useState<string | null>("Sarah"); // Hardcoded for demo
  
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
        
        return messages.map(msg => ({
          id: msg.id,
          senderId: msg.sender_id === user.id ? "user" : "Sarah",
          text: msg.text,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          status: msg.status,
          attachments: msg.attachments
        }));
      } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
    },
    enabled: !!currentReceiverId && !!user
  });

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
                <MessageConversation messages={messages} />
              )}
            </div>
            
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CommunicationsPage;
