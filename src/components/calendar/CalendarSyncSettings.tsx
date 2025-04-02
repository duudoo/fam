
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, Info, Mail } from 'lucide-react';
import { useCalendarSync } from '@/hooks/useCalendarSync';
import ProviderCard from './sync/ProviderCard';
import { useSearchParams } from 'react-router-dom';

const CalendarSyncSettings = () => {
  const { 
    syncStatus, 
    connectProvider, 
    syncCalendar, 
    disconnectProvider 
  } = useCalendarSync();
  
  const [searchParams] = useSearchParams();
  const provider = searchParams.get('provider');
  const hasError = searchParams.get('error');
  
  // Show toast if there's an error in URL params
  useEffect(() => {
    if (provider && hasError) {
      console.error(`Error connecting to ${provider} calendar: ${hasError}`);
    }
  }, [provider, hasError]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-famacle-slate">Calendar Integrations</h2>
          <p className="text-sm text-famacle-slate-light">Connect and sync your external calendars</p>
        </div>
      </div>
      
      <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-100">
        <Info className="h-4 w-4" />
        <AlertTitle>Calendar Sync</AlertTitle>
        <AlertDescription>
          Connect your external calendars to view all your events in one place. Your external calendar events will be imported into Famacle.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="google" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="google" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Google Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="outlook" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Outlook Calendar</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="google">
          <ProviderCard
            title="Google Calendar"
            description="Import your Google Calendar events into Famacle"
            provider="google"
            status={syncStatus.google}
            lastSynced={syncStatus.lastSynced?.google}
            onConnect={() => connectProvider('google')}
            onSync={() => syncCalendar('google')}
            onDisconnect={() => disconnectProvider('google')}
            icon={<Calendar className="h-4 w-4" />}
          />
        </TabsContent>
        
        <TabsContent value="outlook">
          <ProviderCard
            title="Outlook Calendar"
            description="Import your Outlook Calendar events into Famacle"
            provider="outlook"
            status={syncStatus.outlook}
            lastSynced={syncStatus.lastSynced?.outlook}
            onConnect={() => connectProvider('outlook')}
            onSync={() => syncCalendar('outlook')}
            onDisconnect={() => disconnectProvider('outlook')}
            icon={<Mail className="h-4 w-4" />}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarSyncSettings;
