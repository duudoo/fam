
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

    // Create a channel for real-time message updates
    const channel = supabase
      .channel('messages-subscription')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${userId}`,
        },
        () => {
          // Invalidate and refetch messages when sender_id matches current user
          queryClient.invalidateQueries({ queryKey: ['messages', currentReceiverId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        () => {
          // Invalidate and refetch messages when receiver_id matches current user
          queryClient.invalidateQueries({ queryKey: ['messages', currentReceiverId] });
        }
      )
      .subscribe();

    // Cleanup: remove the channel when component unmounts or dependencies change
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, currentReceiverId, queryClient]);
};
