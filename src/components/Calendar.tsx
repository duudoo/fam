
import { useState } from 'react';
import { format, addDays, isWithinInterval, isSameDay, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { mockEvents } from '@/utils/mockData';
import { Event, EventPriority } from '@/utils/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  
  // Helper functions for the calendar
  const getPriorityColor = (priority: EventPriority) => {
    switch(priority) {
      case 'high':
        return 'text-famacle-coral';
      case 'medium':
        return 'text-famacle-blue';
      case 'low':
      default:
        return 'text-famacle-slate-light';
    }
  };
  
  const getEventsByDate = (date: Date) => {
    return mockEvents.filter(event => {
      const eventStartDate = parseISO(event.startDate);
      const eventEndDate = event.endDate ? parseISO(event.endDate) : eventStartDate;
      
      return event.allDay 
        ? isSameDay(eventStartDate, date)
        : isWithinInterval(date, { start: eventStartDate, end: eventEndDate });
    });
  };
  
  const eventForDate = (date: Date) => {
    const eventsToday = getEventsByDate(date);
    return eventsToday.length > 0;
  };
  
  // View toggle
  const toggleView = () => {
    setView(view === 'month' ? 'week' : 'month');
  };
  
  // Navigation
  const goToPreviousPeriod = () => {
    if (view === 'month') {
      const previousMonth = new Date(date);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      setDate(previousMonth);
    } else {
      setDate(addDays(date, -7));
    }
  };
  
  const goToNextPeriod = () => {
    if (view === 'month') {
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setDate(nextMonth);
    } else {
      setDate(addDays(date, 7));
    }
  };
  
  const goToToday = () => {
    setDate(new Date());
  };
  
  // Week view helper
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(date, i - date.getDay()));
  
  // Event detail component
  const EventDetail = ({ event }: { event: Event }) => {
    const startTime = format(parseISO(event.startDate), 'h:mm a');
    const endTime = event.endDate ? format(parseISO(event.endDate), 'h:mm a') : '';
    
    return (
      <div className="p-3 border-l-2 border-famacle-blue mb-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <h4 className="font-medium">{event.title}</h4>
          <Flag className={cn("w-4 h-4", getPriorityColor(event.priority))} />
        </div>
        
        {!event.allDay && (
          <p className="text-sm text-gray-500">
            {startTime} {endTime && `- ${endTime}`}
          </p>
        )}
        
        {event.location && (
          <p className="text-sm text-gray-500 mt-1">
            {event.location}
          </p>
        )}
        
        {event.description && (
          <p className="text-sm mt-2">
            {event.description}
          </p>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-famacle-slate">
            {view === 'month' 
              ? format(date, 'MMMM yyyy')
              : `Week of ${format(weekDays[0], 'MMM d')} - ${format(weekDays[6], 'MMM d, yyyy')}`
            }
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToPreviousPeriod}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToToday}
            className="h-8"
          >
            Today
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToNextPeriod}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Select
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="p-3 pointer-events-auto"
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleView}
            className="h-8"
          >
            {view === 'month' ? 'Week View' : 'Month View'}
          </Button>
        </div>
      </div>
      
      {view === 'month' ? (
        <div>
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border"
            modifiers={{
              event: (date) => eventForDate(date),
            }}
            modifiersClassNames={{
              event: "has-event",
            }}
            components={{
              Day: ({ date: dayDate, ...props }) => {
                const events = getEventsByDate(dayDate);
                const hasEvents = events.length > 0;
                
                return (
                  <div
                    className={cn(
                      "relative p-3 transition-colors hover:bg-muted/50",
                      props.className
                    )}
                    style={{ textAlign: "center" }}
                    onClick={() => props.onClick?.()}
                  >
                    <div className="absolute top-0 left-0 right-0 flex justify-center">
                      {hasEvents && !isSameDay(dayDate, date) && (
                        <div className="w-1 h-1 bg-famacle-blue rounded-full mt-1" />
                      )}
                    </div>
                    <span className="text-sm">{format(dayDate, "d")}</span>
                    
                    {hasEvents && events.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {events.slice(0, 2).map((event) => (
                          <div 
                            key={event.id} 
                            className={cn(
                              "text-xs truncate rounded px-1 py-0.5",
                              isSameDay(dayDate, date)
                                ? "bg-white/20 text-white" 
                                : "bg-famacle-blue-light text-famacle-blue"
                            )}
                          >
                            {event.title}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{events.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
          
          {/* Event list for selected date */}
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">
              Events for {format(date, 'MMMM d, yyyy')}
            </h3>
            
            <div className="space-y-2">
              {getEventsByDate(date).length > 0 ? (
                getEventsByDate(date).map(event => (
                  <EventDetail key={event.id} event={event} />
                ))
              ) : (
                <p className="text-gray-500">No events scheduled for this day.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Week view
        <div className="grid grid-cols-7 gap-2 mt-4">
          {weekDays.map((day, index) => (
            <div key={index} className="min-h-[200px]">
              <div className={cn(
                "text-center p-2 rounded-t-md font-medium",
                isSameDay(day, new Date()) ? "bg-famacle-blue text-white" : "bg-gray-100"
              )}>
                <div className="text-xs">{format(day, 'EEE')}</div>
                <div className="text-sm">{format(day, 'd')}</div>
              </div>
              
              <div className="border border-t-0 rounded-b-md p-1 h-full min-h-[160px]">
                {getEventsByDate(day).map(event => (
                  <div 
                    key={event.id} 
                    className="text-xs p-1 mb-1 rounded bg-famacle-blue-light text-famacle-blue truncate"
                  >
                    {!event.allDay && format(parseISO(event.startDate), 'h:mm a')} {event.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Add New Event</CardTitle>
          <CardDescription>Schedule a new activity or appointment</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Create new events to keep track of important activities and appointments.
          </p>
          <div className="mt-4 space-y-2">
            <Badge className="mr-2 bg-famacle-coral text-white">High Priority</Badge>
            <Badge className="mr-2 bg-famacle-blue text-white">Medium Priority</Badge>
            <Badge className="mr-2 bg-famacle-slate-light">Low Priority</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Add New Event</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CalendarView;
