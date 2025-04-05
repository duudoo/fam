
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isToday, isAfter, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import AddEventDialog from '../calendar/AddEventDialog';

const UpcomingEventsCard = () => {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { createEvent, isPending, events = [], isLoading } = useCalendarEvents();
  
  // Filter to show only upcoming events (starting from today)
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.startDate);
      return isAfter(eventDate, startOfDay(new Date())) || isToday(eventDate);
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3); // Limit to 3 events
    
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Upcoming Events</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/calendar" className="flex items-center text-famacle-blue">
              Calendar
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin h-6 w-6 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => {
                const eventDate = parseISO(event.startDate);
                const isEventToday = isToday(eventDate);
                
                return (
                  <div 
                    key={event.id} 
                    className={cn(
                      "p-3 rounded-lg border",
                      isEventToday 
                        ? "border-famacle-coral bg-famacle-coral-light/30" 
                        : "border-gray-200"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">
                          {event.title}
                          {isEventToday && (
                            <Badge className="ml-2 bg-famacle-coral text-white">Today</Badge>
                          )}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {format(parseISO(event.startDate), 'EEE, MMM d')}
                          {!event.allDay && ` • ${format(parseISO(event.startDate), 'h:mm a')}`}
                        </p>
                        {event.location && (
                          <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                        )}
                      </div>
                      <div className={cn(
                        "flex items-center justify-center rounded-full w-8 h-8",
                        event.priority === 'high' 
                          ? "bg-famacle-coral-light text-famacle-coral" 
                          : event.priority === 'medium'
                            ? "bg-famacle-blue-light text-famacle-blue"
                            : "bg-gray-100 text-gray-500"
                      )}>
                        <Calendar className="w-4 h-4" />
                      </div>
                    </div>
                    {event.source && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        From {event.source === 'google' ? 'Google' : 'Outlook'} Calendar
                      </Badge>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No upcoming events</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Event
        </Button>
      </CardFooter>

      {/* Event Dialog */}
      <AddEventDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </Card>
  );
};

export default UpcomingEventsCard;
