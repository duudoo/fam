
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, Check, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCalendarSync } from '@/hooks/useCalendarSync';
import { Badge } from '@/components/ui/badge';

const CalendarSyncCard = () => {
  const { syncStatus, connectProvider } = useCalendarSync();
  const [hasConnectedCalendars, setHasConnectedCalendars] = useState(false);
  
  useEffect(() => {
    const hasConnected = syncStatus.google === 'connected' || syncStatus.outlook === 'connected';
    setHasConnectedCalendars(hasConnected);
  }, [syncStatus]);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Calendar Sync</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/settings?tab=calendar" className="flex items-center text-famacle-blue">
              Manage
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hasConnectedCalendars ? (
            <div className="space-y-3">
              {syncStatus.google === 'connected' && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <CalendarClock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Google Calendar</p>
                      <p className="text-sm text-gray-500">
                        {syncStatus.lastSynced?.google ? 
                          `Last synced: ${new Date(syncStatus.lastSynced.google).toLocaleString()}` : 
                          'Connected'}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    <Check className="h-3 w-3 mr-1" /> Connected
                  </Badge>
                </div>
              )}
              
              {syncStatus.outlook === 'connected' && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <CalendarClock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Outlook Calendar</p>
                      <p className="text-sm text-gray-500">
                        {syncStatus.lastSynced?.outlook ? 
                          `Last synced: ${new Date(syncStatus.lastSynced.outlook).toLocaleString()}` : 
                          'Connected'}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    <Check className="h-3 w-3 mr-1" /> Connected
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <CalendarClock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600 mb-4">No calendars connected yet</p>
              <p className="text-sm text-gray-500">
                Connect your external calendars to view all your events in one place.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        {!hasConnectedCalendars ? (
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => connectProvider('google')}
            >
              Connect Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => connectProvider('outlook')}
            >
              Connect Outlook
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            asChild
          >
            <Link to="/settings?tab=calendar">
              Manage Calendars
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CalendarSyncCard;
