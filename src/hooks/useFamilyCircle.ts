
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CoParentInvite, Parent } from "@/utils/types";
import { toast } from "sonner";
import { fetchSentInvites, fetchReceivedInvites, createInvite as apiCreateInvite } from "@/lib/api/invites";

export const useFamilyCircle = () => {
  const { user, profile } = useAuth();
  const [invites, setInvites] = useState<CoParentInvite[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<CoParentInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Parent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Set up the current user data when profile is loaded
  useEffect(() => {
    if (profile && user) {
      setCurrentUser({
        id: user.id,
        name: profile.full_name || profile.first_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: profile.avatar_url,
        phone: profile.phone
      });
    }
  }, [user, profile]);

  // Fetch co-parent invites when user changes
  const fetchInvites = useCallback(async () => {
    try {
      if (!user) {
        console.log("Cannot fetch invites: No user logged in");
        setInvites([]);
        setReceivedInvites([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const sentInviteData = await fetchSentInvites(user.id);
        setInvites(sentInviteData);
      } catch (err) {
        console.error('Error fetching sent invites:', err);
        setError("Unable to load sent invites");
      }
      
      // We'll still try to fetch received invites, but we'll suppress the errors in the UI
      // since registered users may not have received any invites
      if (user.email) {
        try {
          const receivedInviteData = await fetchReceivedInvites(user.email);
          setReceivedInvites(receivedInviteData);
        } catch (err) {
          console.error('Error fetching received invites:', err);
          // We're now suppressing this error in the UI
          setReceivedInvites([]);
        }
      } else {
        setReceivedInvites([]);
      }
      
    } catch (error) {
      console.error('Error fetching invites:', error);
      setError("Unable to load co-parent invites");
      toast.error("Failed to load co-parent invites");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Set up real-time subscription for co-parent invites
  useEffect(() => {
    if (!user) return;
    
    // Subscribe to changes in co-parent_invites table
    const channel = supabase
      .channel('co-parent-invites-changes')
      .on('postgres_changes', {
        event: '*', 
        schema: 'public',
        table: 'co_parent_invites',
        filter: `invited_by=eq.${user.id}`
      }, (payload) => {
        console.log('Received invite update:', payload);
        fetchInvites();
      })
      .on('postgres_changes', {
        event: '*', 
        schema: 'public',
        table: 'co_parent_invites',
        filter: user.email ? `email=eq.${user.email}` : undefined
      }, (payload) => {
        console.log('Received invite update (as recipient):', payload);
        fetchInvites();
      })
      .subscribe();
    
    // Fetch initial data
    fetchInvites();
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchInvites]);

  const createInvite = useCallback(async (email: string, message?: string) => {
    try {
      if (!user) {
        return { error: "You must be signed in to send invitations" };
      }
      
      // Validate the email is not the current user's email
      if (user.email === email) {
        return { error: "You cannot invite yourself" };
      }
      
      // Now use our API function to create the invitation
      const result = await apiCreateInvite(email, user.id, message);
      
      if (result.error) {
        return { error: result.error };
      }
      
      return { data: result.data };
    } catch (error) {
      console.error("Error creating invitation:", error);
      return { error: "Failed to create invitation" };
    }
  }, [user]);

  // Function to handle resending invitations
  const resendInvite = useCallback(async (inviteId: string, email: string, message?: string) => {
    try {
      if (!user) {
        return { error: "You must be signed in to send invitations" };
      }
      
      // First, update the original invitation to declined/expired status
      const { error: updateError } = await supabase
        .from('co_parent_invites')
        .update({
          status: 'expired',
          responded_at: new Date().toISOString()
        })
        .eq('id', inviteId);
        
      if (updateError) {
        console.error("Error updating invitation:", updateError);
        return { error: "Failed to process invitation resend" };
      }
      
      // Create a new invitation
      return await createInvite(email, message);
      
    } catch (error) {
      console.error("Error resending invitation:", error);
      return { error: "Failed to resend invitation" };
    }
  }, [user, createInvite]);

  return {
    currentUser,
    invites,
    receivedInvites,
    setInvites,
    setReceivedInvites,
    loading,
    error,
    fetchInvites,
    createInvite,
    resendInvite
  };
};
