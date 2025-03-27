
import { Calendar, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Event } from '@/utils/types';
import { format } from 'date-fns';

interface UpcomingEventsCardProps {
  upcomingEvents: Event[];
}

const UpcomingEventsCard = ({ upcomingEvents }: UpcomingEventsCardProps) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-famacle-coral" />
        Upcoming Events
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-famacle-slate">{upcomingEvents.length}</div>
      <p className="text-gray-500 text-sm">
        Next: {upcomingEvents.length > 0 
          ? format(new Date(upcomingEvents[0].startDate), 'MMM d')
          : 'No upcoming events'}
      </p>
    </CardContent>
    <div className="absolute top-0 right-0 p-3">
      <Bell className="w-6 h-6 text-famacle-coral" />
    </div>
  </Card>
);

export default UpcomingEventsCard;
