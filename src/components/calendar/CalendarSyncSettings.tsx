
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Check, Info, Loader2, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import useAuth from '@/hooks/useAuth';

type SyncStatus = {
  google: 'connected' | 'disconnected' | 'syncing' | 'error';
  outlook: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSynced?: {
    google?: Date;
    outlook?: Date;
  };
};

const CalendarSyncSettings = () => {
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    google: 'disconnected',
    outlook: 'disconnected',
    lastSynced: {},
  });
  
  const connectGoogle = async () => {
    try {
      window.location.href = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calendar-sync/google-auth`;
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      toast.error('Failed to connect Google Calendar');
    }
  };
  
  const connectOutlook = async () => {
    try {
      window.location.href = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calendar-sync/outlook-auth`;
    } catch (error) {
      console.error('Error connecting Outlook Calendar:', error);
      toast.error('Failed to connect Outlook Calendar');
    }
  };
  
  const syncGoogleCalendar = async () => {
    if (!user?.id) return;
    
    try {
      setSyncStatus(prev => ({ ...prev, google: 'syncing' }));
      
      // Here we would use the stored refresh token to get a new access token
      // For demo purposes, assume we have a valid token
      const mockToken = 'valid-google-token';
      
      const { data, error } = await supabase.functions.invoke('calendar-sync/sync', {
        body: { provider: 'google', token: mockToken, userId: user.id }
      });
      
      if (error) throw error;
      
      setSyncStatus(prev => ({
        ...prev,
        google: 'connected',
        lastSynced: { ...prev.lastSynced, google: new Date() }
      }));
      
      toast.success(`Successfully synced ${data.count} events from Google Calendar`);
    } catch (error) {
      console.error('Error syncing Google Calendar:', error);
      setSyncStatus(prev => ({ ...prev, google: 'error' }));
      toast.error('Failed to sync Google Calendar');
    }
  };
  
  const syncOutlookCalendar = async () => {
    if (!user?.id) return;
    
    try {
      setSyncStatus(prev => ({ ...prev, outlook: 'syncing' }));
      
      // Here we would use the stored refresh token to get a new access token
      // For demo purposes, assume we have a valid token
      const mockToken = 'valid-outlook-token';
      
      const { data, error } = await supabase.functions.invoke('calendar-sync/sync', {
        body: { provider: 'outlook', token: mockToken, userId: user.id }
      });
      
      if (error) throw error;
      
      setSyncStatus(prev => ({
        ...prev,
        outlook: 'connected',
        lastSynced: { ...prev.lastSynced, outlook: new Date() }
      }));
      
      toast.success(`Successfully synced ${data.count} events from Outlook Calendar`);
    } catch (error) {
      console.error('Error syncing Outlook Calendar:', error);
      setSyncStatus(prev => ({ ...prev, outlook: 'error' }));
      toast.error('Failed to sync Outlook Calendar');
    }
  };
  
  const disconnectGoogle = async () => {
    try {
      // In a real app, we would revoke the access token
      setSyncStatus(prev => ({ ...prev, google: 'disconnected' }));
      toast.success('Disconnected from Google Calendar');
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      toast.error('Failed to disconnect Google Calendar');
    }
  };
  
  const disconnectOutlook = async () => {
    try {
      // In a real app, we would revoke the access token
      setSyncStatus(prev => ({ ...prev, outlook: 'disconnected' }));
      toast.success('Disconnected from Outlook Calendar');
    } catch (error) {
      console.error('Error disconnecting Outlook Calendar:', error);
      toast.error('Failed to disconnect Outlook Calendar');
    }
  };
  
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Google Calendar</span>
                {syncStatus.google !== 'disconnected' && (
                  <Badge variant={syncStatus.google === 'error' ? 'destructive' : 'outline'} className="ml-2">
                    {syncStatus.google === 'connected' && <Check className="h-3 w-3 mr-1" />}
                    {syncStatus.google === 'syncing' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                    {syncStatus.google}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Import your Google Calendar events into Famacle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {syncStatus.google === 'disconnected' ? (
                <Button onClick={connectGoogle} className="bg-famacle-blue hover:bg-famacle-blue-dark">
                  Connect Google Calendar
                </Button>
              ) : (
                <div className="space-y-4">
                  {syncStatus.lastSynced?.google && (
                    <p className="text-sm text-famacle-slate-light">
                      Last synced: {syncStatus.lastSynced.google.toLocaleString()}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      onClick={syncGoogleCalendar} 
                      disabled={syncStatus.google === 'syncing'}
                      className="bg-famacle-blue hover:bg-famacle-blue-dark"
                    >
                      {syncStatus.google === 'syncing' && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Sync Now
                    </Button>
                    <Button 
                      onClick={disconnectGoogle} 
                      variant="outline" 
                      disabled={syncStatus.google === 'syncing'}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="outlook">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Outlook Calendar</span>
                {syncStatus.outlook !== 'disconnected' && (
                  <Badge variant={syncStatus.outlook === 'error' ? 'destructive' : 'outline'} className="ml-2">
                    {syncStatus.outlook === 'connected' && <Check className="h-3 w-3 mr-1" />}
                    {syncStatus.outlook === 'syncing' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                    {syncStatus.outlook}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Import your Outlook Calendar events into Famacle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {syncStatus.outlook === 'disconnected' ? (
                <Button onClick={connectOutlook} className="bg-famacle-blue hover:bg-famacle-blue-dark">
                  Connect Outlook Calendar
                </Button>
              ) : (
                <div className="space-y-4">
                  {syncStatus.lastSynced?.outlook && (
                    <p className="text-sm text-famacle-slate-light">
                      Last synced: {syncStatus.lastSynced.outlook.toLocaleString()}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      onClick={syncOutlookCalendar} 
                      disabled={syncStatus.outlook === 'syncing'}
                      className="bg-famacle-blue hover:bg-famacle-blue-dark"
                    >
                      {syncStatus.outlook === 'syncing' && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Sync Now
                    </Button>
                    <Button 
                      onClick={disconnectOutlook} 
                      variant="outline" 
                      disabled={syncStatus.outlook === 'syncing'}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarSyncSettings;
