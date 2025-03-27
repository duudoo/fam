
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { RealtimeChannel } from "@supabase/supabase-js";

export const useExpenseSubscription = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  // Function to setup subscription
  const subscribeToExpenses = () => {
    if (!userId) return null;

    console.log("Setting up expense subscription for user", userId);

    // Create a channel for real-time expense updates
    const channel = supabase
      .channel('expenses-subscription')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: `paid_by=eq.${userId}`,
        },
        (payload) => {
          console.log("Received expense update (user is payer):", payload);
          queryClient.invalidateQueries({ queryKey: ['expenses'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: '',  // Listen to all expenses as co-parent might add expenses
        },
        (payload) => {
          console.log("Received any expense update:", payload);
          queryClient.invalidateQueries({ queryKey: ['expenses'] });
        }
      )
      .subscribe((status) => {
        console.log(`Realtime expenses subscription status: ${status}`);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to expense updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to expense updates');
        }
      });

    return channel;
  };

  // Setup subscription on component mount
  useEffect(() => {
    const channel = subscribeToExpenses();
    return () => {
      if (channel) {
        console.log("Cleaning up expense subscription");
        supabase.removeChannel(channel);
      }
    };
  }, [userId, queryClient]);

  return { subscribeToExpenses };
};
