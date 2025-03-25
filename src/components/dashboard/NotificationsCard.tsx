
import { Link } from 'react-router-dom';
import { Bell, ChevronRight, Receipt } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { mockNotifications } from '@/utils/mockData';
import { cn } from '@/lib/utils';

const NotificationsCard = () => {
  const recentNotifications = mockNotifications
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 3);
    
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Notifications</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/notifications" className="flex items-center text-famacle-blue">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={cn(
                "p-3 rounded-lg border flex items-start gap-3",
                notification.read 
                  ? "border-gray-200" 
                  : "border-famacle-blue-light bg-famacle-blue-light/30"
              )}
            >
              <div className={cn(
                "flex items-center justify-center rounded-full w-8 h-8 shrink-0",
                notification.type.includes('expense') 
                  ? "bg-famacle-blue-light text-famacle-blue" 
                  : "bg-famacle-coral-light text-famacle-coral"
              )}>
                {notification.type.includes('expense') ? (
                  <Receipt className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>
              
              <div>
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button asChild variant="outline" className="w-full">
          <Link to="/notifications">
            <Bell className="w-4 h-4 mr-2" />
            All Notifications
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationsCard;
