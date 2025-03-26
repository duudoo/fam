
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { MessageConversation } from "@/components/communication/MessageConversation";
import { MessageInput } from "@/components/communication/MessageInput";
import { ConversationHeader } from "@/components/communication/ConversationHeader";
import { Message } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CommunicationsPage = () => {
  const queryClient = useQueryClient();
  const [currentReceiverId, setCurrentReceiverId] = useState<string | null>(null);
  
  // Fetch messages for the current conversation
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', currentReceiverId],
    queryFn: async () => {
      if (!currentReceiverId) return [];
      
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentReceiverId},receiver_id.eq.${currentReceiverId}`)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return messages.map(msg => ({
        id: msg.id,
        senderId: msg.sender_id,
        text: msg.text,
        timestamp: new Date(msg.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        status: msg.status,
        attachments: msg.attachments
      }));
    },
    enabled: !!currentReceiverId
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (newMsg: Omit<Message, "id" | "status">) => {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: (await supabase.auth.getUser()).data.user?.id,
          receiver_id: currentReceiverId,
          text: newMsg.text,
          attachments: newMsg.attachments
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', currentReceiverId] });
    }
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentReceiverId) return;

    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentReceiverId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', currentReceiverId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentReceiverId, queryClient]);

  const handleSendMessage = async (newMsg: Omit<Message, "id" | "status">) => {
    if (!currentReceiverId) return;
    
    try {
      await sendMessageMutation.mutateAsync(newMsg);
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
              {isLoading ? (
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
