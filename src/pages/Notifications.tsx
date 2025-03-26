
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Bell, Calendar, Check, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Notification, NotificationType } from "@/utils/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NotificationsPage = () => {
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();
  
  // Fetch notifications from Supabase
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
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
    }
  });
  
  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      toast.error("Failed to mark notification as read");
    }
  });
  
  // Mark all notifications as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success("All notifications marked as read");
    },
    onError: () => {
      toast.error("Failed to mark all notifications as read");
    }
  });
  
  // Listen for real-time notifications updates
  useEffect(() => {
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
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };
  
  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };
  
  const getNotificationIcon = (type: NotificationType) => {
    if (type.includes('expense')) {
      return <Receipt className="w-5 h-5 text-famacle-blue" />;
    } else if (type.includes('event')) {
      return <Calendar className="w-5 h-5 text-famacle-coral" />;
    } else {
      return <Bell className="w-5 h-5 text-famacle-slate" />;
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <div className="mb-8 animate-fade-in">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-famacle-slate">Notifications</h1>
              <p className="text-gray-500 mt-1">Stay up-to-date with activities and expenses</p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              disabled={isLoading || markAllAsReadMutation.isPending}
            >
              <Check className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Bell className="w-5 h-5 mr-2 text-famacle-blue" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" onValueChange={setFilter}>
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="expense">Expenses</TabsTrigger>
                  <TabsTrigger value="event">Events</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <NotificationList 
                    notifications={filteredNotifications} 
                    markAsRead={markAsRead}
                    getNotificationIcon={getNotificationIcon}
                    isLoading={isLoading}
                    isPending={markAsReadMutation.isPending}
                  />
                </TabsContent>
                
                <TabsContent value="unread" className="mt-0">
                  <NotificationList 
                    notifications={filteredNotifications} 
                    markAsRead={markAsRead}
                    getNotificationIcon={getNotificationIcon}
                    isLoading={isLoading}
                    isPending={markAsReadMutation.isPending}
                  />
                </TabsContent>
                
                <TabsContent value="expense" className="mt-0">
                  <NotificationList 
                    notifications={filteredNotifications} 
                    markAsRead={markAsRead}
                    getNotificationIcon={getNotificationIcon}
                    isLoading={isLoading}
                    isPending={markAsReadMutation.isPending}
                  />
                </TabsContent>
                
                <TabsContent value="event" className="mt-0">
                  <NotificationList 
                    notifications={filteredNotifications} 
                    markAsRead={markAsRead}
                    getNotificationIcon={getNotificationIcon}
                    isLoading={isLoading}
                    isPending={markAsReadMutation.isPending}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  getNotificationIcon: (type: NotificationType) => JSX.Element;
  isLoading: boolean;
  isPending: boolean;
}

const NotificationList = ({ 
  notifications, 
  markAsRead,
  getNotificationIcon,
  isLoading,
  isPending
}: NotificationListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    );
  }
  
  if (notifications.length === 0) {
    return (
      <div className="text-center py-10">
        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No notifications to display</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className={cn(
            "p-4 border rounded-lg transition-colors hover:bg-gray-50",
            notification.read 
              ? "border-gray-200" 
              : "border-famacle-blue-light bg-famacle-blue-light/10"
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
              notification.type.includes('expense') 
                ? "bg-famacle-blue-light" 
                : notification.type.includes('event')
                  ? "bg-famacle-coral-light"
                  : "bg-gray-100"
            )}>
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between">
                <p className={cn(
                  "text-gray-800",
                  !notification.read && "font-medium"
                )}>
                  {notification.message}
                </p>
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-gray-500 hover:text-famacle-blue"
                    onClick={() => markAsRead(notification.id)}
                    disabled={isPending}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-500">
                  {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
                
                {notification.type.includes('expense') && (
                  <Badge variant="outline" className="bg-famacle-blue-light/20 text-famacle-blue border-famacle-blue/20">
                    Expense
                  </Badge>
                )}
                
                {notification.type.includes('event') && (
                  <Badge variant="outline" className="bg-famacle-coral-light/20 text-famacle-coral border-famacle-coral/20">
                    Event
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPage;
