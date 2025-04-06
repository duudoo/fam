
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchSentInvites, fetchReceivedInvites, createInvite as apiCreateInvite } from '@/lib/api/invites';
import { CoParentInvite, Parent } from '@/utils/types';
import { toast } from 'sonner';

export const useFamilyCircle = () => {
  const { user, profile } = useAuth();
  const [invites, setInvites] = useState<CoParentInvite[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<CoParentInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Parent | null>(null);

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
    } else if (user) {
      // If we have a user but no profile, create a minimal user object
      setCurrentUser({
        id: user.id,
        name: user.email?.split('@')[0] || 'User',
        email: user.email || '',
      });
    }
  }, [user, profile]);

  // Fetch co-parent invites
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
        // Fetch sent invites - this now returns empty array on error
        const sentInviteData = await fetchSentInvites(user.id);
        setInvites(sentInviteData || []);
      } catch (err: any) {
        console.error('Error fetching sent invites:', err);
        setInvites([]);
        // Don't set error for silent failures in background fetching
      }
      
      // Fetch received invites if user has email
      if (user.email) {
        try {
          console.log("Fetching received invites for email:", user.email);
          const receivedInviteData = await fetchReceivedInvites(user.email);
          setReceivedInvites(receivedInviteData || []);
        } catch (err: any) {
          console.error('Error fetching received invites:', err);
          setReceivedInvites([]);
          // Don't set error for silent failures in background fetching
        }
      } else {
        setReceivedInvites([]);
      }
      
    } catch (error: any) {
      console.error('Error fetching invites:', error);
      setError("Unable to load co-parent invites");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch invites when user changes
  useEffect(() => {
    if (user) {
      fetchInvites();
    }
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
      
      // If successful, refresh the invites list
      await fetchInvites();
      
      return { data: result.data };
    } catch (error: any) {
      console.error("Error creating invitation:", error);
      return { error: error.message || "Failed to create invitation" };
    }
  }, [user, fetchInvites]);

  return {
    currentUser,
    invites,
    receivedInvites,
    loading,
    error,
    fetchInvites,
    createInvite,
    setInvites,
    setReceivedInvites
  };
};
