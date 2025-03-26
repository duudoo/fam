
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NotificationType } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";

export const useNotifications = () => {
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Fetch notifications from Supabase
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: notificationsData, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error("Failed to load notifications");
        throw error;
      }
      
      return notificationsData.map(notification => ({
        id: notification.id,
        type: notification.type as NotificationType,
        message: notification.message,
        relatedId: notification.related_id || undefined,
        createdAt: notification.created_at,
        read: notification.read
      }));
    },
    enabled: !!user,
  });
  
  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
    onError: () => {
      toast.error("Failed to mark notification as read");
    }
  });
  
  // Mark all notifications as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      toast.success("All notifications marked as read");
    },
    onError: () => {
      toast.error("Failed to mark all notifications as read");
    }
  });
  
  // Listen for real-time notifications updates
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, user]);
  
  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };
  
  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };
  
  const getFilteredNotifications = () => {
    if (filter === 'all') {
      return notifications;
    } else if (filter === 'unread') {
      return notifications.filter(notification => !notification.read);
    } else {
      return notifications.filter(notification => notification.type.includes(filter));
    }
  };
  
  const filteredNotifications = getFilteredNotifications();

  return {
    filter,
    setFilter,
    notifications,
    filteredNotifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    isPending: markAsReadMutation.isPending || markAllAsReadMutation.isPending
  };
};
