
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import Navbar from "@/components/Navbar";
import NotificationHeader from "@/components/notifications/NotificationHeader";
import NotificationFilter from "@/components/notifications/NotificationFilter";
import { useNotifications } from "@/hooks/useNotifications";

const NotificationsPage = () => {
  const {
    filter,
    setFilter,
    filteredNotifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    isPending
  } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <div className="mb-8 animate-fade-in">
          <NotificationHeader 
            markAllAsRead={markAllAsRead} 
            isLoading={isLoading}
            isPending={isPending}
          />
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Bell className="w-5 h-5 mr-2 text-famacle-blue" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationFilter
                filter={filter}
                setFilter={setFilter}
                filteredNotifications={filteredNotifications}
                markAsRead={markAsRead}
                isLoading={isLoading}
                isPending={isPending}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
