
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Event } from "@/utils/types";
import { format } from "date-fns";

interface UpcomingEventsCardProps {
  upcomingEvents: Event[];
}

const UpcomingEventsCard = ({ upcomingEvents }: UpcomingEventsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Upcoming Events</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/calendar" className="flex items-center text-famacle-blue">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pb-2">
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No upcoming events</div>
        ) : (
          <ul className="space-y-3">
            {upcomingEvents.map((event) => (
              <li key={event.id}>
                <Link to={`/calendar?event=${event.id}`} className="block hover:bg-gray-50 p-2 rounded-md -mx-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(event.startDate), "EEE, MMM d • h:mm a")}
                      </p>
                    </div>
                    {event.priority && (
                      <div className={`text-xs px-2 py-0.5 rounded-full ${event.priority === 'high' ? 'bg-red-100 text-red-700' : event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                        {event.priority}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/calendar?new=true">
            <Calendar className="h-4 w-4 mr-2" />
            Add Event
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingEventsCard;
