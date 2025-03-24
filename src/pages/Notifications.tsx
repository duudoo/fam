
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Bell, Calendar, Check, DollarSign, Receipt } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { mockNotifications } from "@/utils/mockData";
import { Notification, NotificationType } from "@/utils/types";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState("all");
  
  useEffect(() => {
    // Set page title
    document.title = "Notifications | Famacle";
  }, []);
  
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
  };
  
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
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
            
            <Button variant="outline" onClick={markAllAsRead}>
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
                  />
                </TabsContent>
                
                <TabsContent value="unread" className="mt-0">
                  <NotificationList 
                    notifications={filteredNotifications} 
                    markAsRead={markAsRead}
                    getNotificationIcon={getNotificationIcon}
                  />
                </TabsContent>
                
                <TabsContent value="expense" className="mt-0">
                  <NotificationList 
                    notifications={filteredNotifications} 
                    markAsRead={markAsRead}
                    getNotificationIcon={getNotificationIcon}
                  />
                </TabsContent>
                
                <TabsContent value="event" className="mt-0">
                  <NotificationList 
                    notifications={filteredNotifications} 
                    markAsRead={markAsRead}
                    getNotificationIcon={getNotificationIcon}
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
}

const NotificationList = ({ 
  notifications, 
  markAsRead,
  getNotificationIcon 
}: NotificationListProps) => {
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
