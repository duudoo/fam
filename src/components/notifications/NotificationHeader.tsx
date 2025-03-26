
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationHeaderProps {
  markAllAsRead: () => void;
  isLoading: boolean;
  isPending: boolean;
}

const NotificationHeader = ({ 
  markAllAsRead, 
  isLoading, 
  isPending 
}: NotificationHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-3xl font-bold text-famacle-slate">Notifications</h1>
        <p className="text-gray-500 mt-1">Stay up-to-date with activities and expenses</p>
      </div>
      
      <Button 
        variant="outline" 
        onClick={markAllAsRead}
        disabled={isLoading || isPending}
      >
        <Check className="w-4 h-4 mr-2" />
        Mark all as read
      </Button>
    </div>
  );
};

export default NotificationHeader;
