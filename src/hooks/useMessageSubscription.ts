
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useMessageSubscription = (
  userId: string | undefined,
  currentReceiverId: string | null
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId || !currentReceiverId) return;

    console.log("Setting up message subscription for conversation between", userId, "and", currentReceiverId);

    // Create a channel for real-time message updates
    const channel = supabase
      .channel('messages-subscription')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${userId}:receiver_id=eq.${currentReceiverId}`,
        },
        (payload) => {
          console.log("Received message update (user is sender):", payload);
          queryClient.invalidateQueries({ queryKey: ['messages', currentReceiverId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${currentReceiverId}:receiver_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Received message update (user is receiver):", payload);
          queryClient.invalidateQueries({ queryKey: ['messages', currentReceiverId] });
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status: ${status}`);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to message updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to message updates');
        }
      });

    // Cleanup: remove the channel when component unmounts or dependencies change
    return () => {
      console.log("Cleaning up message subscription");
      supabase.removeChannel(channel);
    };
  }, [userId, currentReceiverId, queryClient]);
};
