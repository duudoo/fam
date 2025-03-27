
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useExpenseSubscription = (userId?: string) => {
  // Set up real-time subscription to expenses
  const subscribeToExpenses = useCallback(() => {
    if (!userId) return null;

    const channel = supabase
      .channel('expenses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: `paid_by=eq.${userId}`
        },
        () => {
          // The actual invalidation happens in the main hook
        }
      )
      .subscribe();

    return channel;
  }, [userId]);

  return { subscribeToExpenses };
};
