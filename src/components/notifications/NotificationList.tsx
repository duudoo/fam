
import { Bell, Check } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotificationType } from "@/utils/types";

interface NotificationListProps {
  notifications: {
    id: string;
    type: NotificationType;
    message: string;
    relatedId?: string;
    createdAt: string;
    read: boolean;
  }[];
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

export default NotificationList;
