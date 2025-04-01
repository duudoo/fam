
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the auth context of the function
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Google OAuth configuration
const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') || '';
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET') || '';

// Microsoft OAuth configuration
const MS_CLIENT_ID = Deno.env.get('MS_CLIENT_ID') || '';
const MS_CLIENT_SECRET = Deno.env.get('MS_CLIENT_SECRET') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Authorization endpoints
    if (path === 'google-auth') {
      return handleGoogleAuth(url);
    } else if (path === 'outlook-auth') {
      return handleOutlookAuth(url);
    }
    // Callback endpoints
    else if (path === 'callback') {
      const provider = url.searchParams.get('provider');
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const redirectUrl = state ? JSON.parse(decodeURIComponent(state)).redirect_url : null;
      
      if (!code) {
        return new Response(JSON.stringify({ error: 'Authorization code is missing' }), 
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (provider === 'google') {
        return await handleGoogleCallback(code, redirectUrl);
      } else if (provider === 'outlook') {
        return await handleOutlookCallback(code, redirectUrl);
      }
    }
    // Sync endpoints
    else if (path === 'sync') {
      const { provider, token, userId } = await req.json();
      
      if (!provider || !token || !userId) {
        return new Response(JSON.stringify({ error: 'Missing required parameters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (provider === 'google') {
        return await syncGoogleEvents(token, userId);
      } else if (provider === 'outlook') {
        return await syncOutlookEvents(token, userId);
      }
    }

    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), 
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

// Google OAuth flow
function handleGoogleAuth(url: URL) {
  // Get the redirect URL from the request
  const redirectUrl = url.searchParams.get('redirect_url') || '';
  const REDIRECT_URI = `${supabaseUrl}/functions/v1/calendar-sync/callback`;
  
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID);
  googleAuthUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  googleAuthUrl.searchParams.append('response_type', 'code');
  googleAuthUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/calendar.readonly');
  googleAuthUrl.searchParams.append('access_type', 'offline');
  googleAuthUrl.searchParams.append('prompt', 'consent');
  
  // Store the redirect URL in the state parameter
  const state = JSON.stringify({ provider: 'google', redirect_url: redirectUrl });
  googleAuthUrl.searchParams.append('state', encodeURIComponent(state));

  return new Response(null, {
    status: 302,
    headers: {
      ...corsHeaders,
      Location: googleAuthUrl.toString(),
    },
  });
}

// Outlook OAuth flow
function handleOutlookAuth(url: URL) {
  // Get the redirect URL from the request
  const redirectUrl = url.searchParams.get('redirect_url') || '';
  const REDIRECT_URI = `${supabaseUrl}/functions/v1/calendar-sync/callback`;
  
  const outlookAuthUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
  outlookAuthUrl.searchParams.append('client_id', MS_CLIENT_ID);
  outlookAuthUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  outlookAuthUrl.searchParams.append('response_type', 'code');
  outlookAuthUrl.searchParams.append('scope', 'Calendars.Read');
  outlookAuthUrl.searchParams.append('response_mode', 'query');
  
  // Store the redirect URL in the state parameter
  const state = JSON.stringify({ provider: 'outlook', redirect_url: redirectUrl });
  outlookAuthUrl.searchParams.append('state', encodeURIComponent(state));

  return new Response(null, {
    status: 302,
    headers: {
      ...corsHeaders,
      Location: outlookAuthUrl.toString(),
    },
  });
}

// Handle Google OAuth callback
async function handleGoogleCallback(code: string, redirectUrl: string | null) {
  try {
    const REDIRECT_URI = `${supabaseUrl}/functions/v1/calendar-sync/callback`;
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Failed to exchange code: ${JSON.stringify(errorData)}`);
    }

    const tokenData = await tokenResponse.json();
    
    // Redirect to frontend with token data
    const finalRedirectUrl = new URL(redirectUrl || (Deno.env.get('SITE_URL') || ''));
    finalRedirectUrl.searchParams.append('provider', 'google');
    finalRedirectUrl.searchParams.append('access_token', tokenData.access_token);
    if (tokenData.refresh_token) {
      finalRedirectUrl.searchParams.append('refresh_token', tokenData.refresh_token);
    }
    finalRedirectUrl.searchParams.append('expires_in', tokenData.expires_in.toString());

    return new Response(null, {
      status: 302,
      headers: {
        Location: finalRedirectUrl.toString(),
      },
    });
  } catch (error) {
    console.error('Google callback error:', error);
    
    // Redirect to frontend with error
    const errorRedirectUrl = new URL(redirectUrl || (Deno.env.get('SITE_URL') || ''));
    errorRedirectUrl.searchParams.append('error', encodeURIComponent(error.message));
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: errorRedirectUrl.toString(),
      },
    });
  }
}

// Handle Outlook OAuth callback
async function handleOutlookCallback(code: string, redirectUrl: string | null) {
  try {
    const REDIRECT_URI = `${supabaseUrl}/functions/v1/calendar-sync/callback`;
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: MS_CLIENT_ID,
        client_secret: MS_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Failed to exchange code: ${JSON.stringify(errorData)}`);
    }

    const tokenData = await tokenResponse.json();
    
    // Redirect to frontend with token data
    const finalRedirectUrl = new URL(redirectUrl || (Deno.env.get('SITE_URL') || ''));
    finalRedirectUrl.searchParams.append('provider', 'outlook');
    finalRedirectUrl.searchParams.append('access_token', tokenData.access_token);
    if (tokenData.refresh_token) {
      finalRedirectUrl.searchParams.append('refresh_token', tokenData.refresh_token);
    }
    finalRedirectUrl.searchParams.append('expires_in', tokenData.expires_in.toString());

    return new Response(null, {
      status: 302,
      headers: {
        Location: finalRedirectUrl.toString(),
      },
    });
  } catch (error) {
    console.error('Outlook callback error:', error);
    
    // Redirect to frontend with error
    const errorRedirectUrl = new URL(redirectUrl || (Deno.env.get('SITE_URL') || ''));
    errorRedirectUrl.searchParams.append('error', encodeURIComponent(error.message));
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: errorRedirectUrl.toString(),
      },
    });
  }
}

// Fetch events from Google Calendar
async function syncGoogleEvents(token: string, userId: string) {
  try {
    const now = new Date();
    const minTime = now.toISOString();
    const maxTime = new Date(now.setMonth(now.getMonth() + 3)).toISOString();

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${minTime}&timeMax=${maxTime}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }

    const data = await response.json();
    const events = data.items.map((item: any) => ({
      id: item.id,
      title: item.summary,
      description: item.description || '',
      startDate: item.start.dateTime || item.start.date,
      endDate: item.end.dateTime || item.end.date,
      allDay: !item.start.dateTime,
      location: item.location || '',
      priority: 'medium',
      source: 'google',
      sourceEventId: item.id
    }));

    // Store the synced events in the database
    await storeExternalEvents(events, userId, 'google');

    return new Response(
      JSON.stringify({ message: 'Success', count: events.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error syncing Google events:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Fetch events from Outlook Calendar
async function syncOutlookEvents(token: string, userId: string) {
  try {
    const now = new Date();
    const minTime = now.toISOString();
    const maxTime = new Date(now.setMonth(now.getMonth() + 3)).toISOString();

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${minTime}&endDateTime=${maxTime}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Microsoft API error: ${response.statusText}`);
    }

    const data = await response.json();
    const events = data.value.map((item: any) => ({
      id: item.id,
      title: item.subject,
      description: item.bodyPreview || '',
      startDate: item.start.dateTime + 'Z',
      endDate: item.end.dateTime + 'Z',
      allDay: item.isAllDay,
      location: item.location?.displayName || '',
      priority: 'medium',
      source: 'outlook',
      sourceEventId: item.id
    }));

    // Store the synced events in the database
    await storeExternalEvents(events, userId, 'outlook');

    return new Response(
      JSON.stringify({ message: 'Success', count: events.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error syncing Outlook events:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Store external calendar events in the database
async function storeExternalEvents(events: any[], userId: string, provider: 'google' | 'outlook') {
  // First, delete existing synced events from this provider
  const { error: deleteError } = await supabase
    .from('events')
    .delete()
    .eq('created_by', userId)
    .eq('source', provider);

  if (deleteError) {
    console.error('Error deleting existing events:', deleteError);
    throw new Error('Failed to delete existing synced events');
  }

  // Then, insert the new events
  if (events.length > 0) {
    const { error: insertError } = await supabase
      .from('events')
      .insert(
        events.map(event => ({
          title: event.title,
          description: event.description,
          start_date: event.startDate,
          end_date: event.endDate,
          all_day: event.allDay,
          location: event.location,
          priority: event.priority,
          created_by: userId,
          source: provider,
          source_event_id: event.sourceEventId
        }))
      );

    if (insertError) {
      console.error('Error inserting events:', insertError);
      throw new Error('Failed to store synced events');
    }
  }
}
