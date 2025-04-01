
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

type SyncStatus = {
  google: 'connected' | 'disconnected' | 'syncing' | 'error';
  outlook: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSynced?: {
    google?: Date;
    outlook?: Date;
  };
};

export const useCalendarSync = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    google: 'disconnected',
    outlook: 'disconnected',
    lastSynced: {},
  });
  
  // Check for auth callback params in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get('provider');
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const error = params.get('error');
    
    if (error) {
      toast.error(`Failed to connect: ${error}`);
      return;
    }
    
    if (provider && accessToken) {
      // Update UI to show connected status
      setSyncStatus(prev => ({
        ...prev,
        [provider]: 'connected',
        lastSynced: { 
          ...prev.lastSynced,
          [provider]: new Date() 
        }
      }));
      
      // Clean URL params
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // If we got tokens, trigger initial sync
      if (user && accessToken) {
        handleSync(provider as 'google' | 'outlook', accessToken);
      }
    }
  }, [user]);
  
  const connectProvider = async (provider: 'google' | 'outlook') => {
    try {
      const siteUrl = window.location.origin;
      window.location.href = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calendar-sync/${provider}-auth?redirect_url=${encodeURIComponent(siteUrl + '/settings?tab=calendar')}`;
    } catch (error) {
      console.error(`Error connecting ${provider} Calendar:`, error);
      toast.error(`Failed to connect ${provider} Calendar`);
    }
  };
  
  const handleSync = async (provider: 'google' | 'outlook', token: string) => {
    if (!user?.id) return;
    
    try {
      setSyncStatus(prev => ({ ...prev, [provider]: 'syncing' }));
      
      const { data, error } = await supabase.functions.invoke('calendar-sync/sync', {
        body: { provider, token, userId: user.id }
      });
      
      if (error) throw error;
      
      setSyncStatus(prev => ({
        ...prev,
        [provider]: 'connected',
        lastSynced: { ...prev.lastSynced, [provider]: new Date() }
      }));
      
      // Refresh events in the calendar
      queryClient.invalidateQueries({ queryKey: ['events'] });
      
      toast.success(`Successfully synced ${data?.count || 0} events from ${provider === 'google' ? 'Google' : 'Outlook'} Calendar`);
    } catch (error) {
      console.error(`Error syncing ${provider} Calendar:`, error);
      setSyncStatus(prev => ({ ...prev, [provider]: 'error' }));
      toast.error(`Failed to sync ${provider === 'google' ? 'Google' : 'Outlook'} Calendar`);
    }
  };
  
  const syncCalendar = async (provider: 'google' | 'outlook') => {
    if (!user?.id) return;
    
    try {
      setSyncStatus(prev => ({ ...prev, [provider]: 'syncing' }));
      
      // For a real implementation, we would retrieve the stored token
      // For now, we'll use the mock token approach
      const mockToken = `valid-${provider}-token`;
      
      await handleSync(provider, mockToken);
    } catch (error) {
      console.error(`Error syncing ${provider} Calendar:`, error);
      setSyncStatus(prev => ({ ...prev, [provider]: 'error' }));
      toast.error(`Failed to sync ${provider} Calendar`);
    }
  };
  
  const disconnectProvider = async (provider: 'google' | 'outlook') => {
    try {
      // In a real app, we would revoke the access token on the server
      setSyncStatus(prev => ({ ...prev, [provider]: 'disconnected' }));
      toast.success(`Disconnected from ${provider === 'google' ? 'Google' : 'Outlook'} Calendar`);
    } catch (error) {
      console.error(`Error disconnecting ${provider} Calendar:`, error);
      toast.error(`Failed to disconnect ${provider} Calendar`);
    }
  };
  
  return {
    syncStatus,
    connectProvider,
    syncCalendar,
    disconnectProvider
  };
};
