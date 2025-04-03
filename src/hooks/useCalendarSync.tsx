
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { syncExternalCalendar } from '@/lib/api/events/syncCalendar';

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
  
  // Store OAuth tokens when received
  const [tokens, setTokens] = useState<{
    google?: string;
    outlook?: string;
  }>({});
  
  // Check for auth callback params in URL when component mounts
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
      console.log('Calendar auth callback detected', { provider });
      
      // Store the token for later use
      if (provider === 'google' || provider === 'outlook') {
        setTokens(prev => ({
          ...prev,
          [provider]: accessToken
        }));
      }
      
      // Update UI to show connected status
      setSyncStatus(prev => ({
        ...prev,
        [provider]: 'connected',
        lastSynced: { 
          ...prev.lastSynced,
          [provider]: new Date() 
        }
      }));
      
      // Clean URL params without reloading the page
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // If we got tokens, trigger initial sync
      if (user && accessToken) {
        handleSync(provider as 'google' | 'outlook', accessToken);
      }
    }
  }, [user]);
  
  const connectProvider = async (provider: 'google' | 'outlook') => {
    try {
      // Get the current site URL to use as redirect URL
      const siteUrl = window.location.origin;
      const redirectPath = '/settings?tab=calendar'; // Ensure we redirect back to the calendar settings tab
      const redirectUrl = `${siteUrl}${redirectPath}`;
      
      // Get Supabase URL from client
      const supabaseUrl = supabase.auth.url ?? 'https://wcezrgcmdrheyacsyimv.supabase.co';
      
      // Redirect to Supabase Edge Function for OAuth flow
      const functionUrl = `${supabaseUrl}/functions/v1/calendar-sync/${provider}-auth`;
      const authUrl = `${functionUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`;
      
      console.log(`Redirecting to auth URL: ${authUrl}`);
      window.location.href = authUrl;
    } catch (error) {
      console.error(`Error connecting ${provider} Calendar:`, error);
      toast.error(`Failed to connect ${provider} Calendar`);
    }
  };
  
  const handleSync = async (provider: 'google' | 'outlook', token: string) => {
    if (!user?.id) return;
    
    try {
      setSyncStatus(prev => ({ ...prev, [provider]: 'syncing' }));
      
      console.log(`Syncing ${provider} calendar with token`, token.substring(0, 5) + '...');
      const { data, error } = await syncExternalCalendar(provider, token, user.id);
      
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
      
      // Use stored token if available
      const token = tokens[provider];
      
      if (!token) {
        throw new Error(`No token available for ${provider}. Please reconnect.`);
      }
      
      await handleSync(provider, token);
    } catch (error) {
      console.error(`Error syncing ${provider} Calendar:`, error);
      setSyncStatus(prev => ({ ...prev, [provider]: 'error' }));
      toast.error(`Failed to sync ${provider} Calendar: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  const disconnectProvider = async (provider: 'google' | 'outlook') => {
    try {
      // Remove the stored token
      setTokens(prev => {
        const newTokens = { ...prev };
        delete newTokens[provider];
        return newTokens;
      });
      
      // Update UI
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
