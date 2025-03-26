
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import NotificationList from "./NotificationList";
import { NotificationType } from "@/utils/types";
import { getNotificationIcon } from "./NotificationIcon";

interface NotificationFilterProps {
  filter: string;
  setFilter: (value: string) => void;
  filteredNotifications: {
    id: string;
    type: NotificationType;
    message: string;
    relatedId?: string;
    createdAt: string;
    read: boolean;
  }[];
  markAsRead: (id: string) => void;
  isLoading: boolean;
  isPending: boolean;
}

const NotificationFilter = ({
  filter,
  setFilter,
  filteredNotifications,
  markAsRead,
  isLoading,
  isPending
}: NotificationFilterProps) => {
  return (
    <Tabs defaultValue={filter} onValueChange={setFilter}>
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
          isPending={isPending}
        />
      </TabsContent>
      
      <TabsContent value="unread" className="mt-0">
        <NotificationList 
          notifications={filteredNotifications} 
          markAsRead={markAsRead}
          getNotificationIcon={getNotificationIcon}
          isLoading={isLoading}
          isPending={isPending}
        />
      </TabsContent>
      
      <TabsContent value="expense" className="mt-0">
        <NotificationList 
          notifications={filteredNotifications} 
          markAsRead={markAsRead}
          getNotificationIcon={getNotificationIcon}
          isLoading={isLoading}
          isPending={isPending}
        />
      </TabsContent>
      
      <TabsContent value="event" className="mt-0">
        <NotificationList 
          notifications={filteredNotifications} 
          markAsRead={markAsRead}
          getNotificationIcon={getNotificationIcon}
          isLoading={isLoading}
          isPending={isPending}
        />
      </TabsContent>
    </Tabs>
  );
};

export default NotificationFilter;
