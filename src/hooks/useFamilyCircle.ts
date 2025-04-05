
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CoParentInvite, Parent } from "@/utils/types";
import { toast } from "sonner";

export const useFamilyCircle = () => {
  const { user, profile } = useAuth();
  const [invites, setInvites] = useState<CoParentInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Parent | null>(null);

  // Set up the current user data when profile is loaded
  useEffect(() => {
    if (profile && user) {
      setCurrentUser({
        id: user.id,
        name: profile.full_name || profile.first_name || 'User',
        email: user.email || '',
        avatar: profile.avatar_url,
        phone: profile.phone
      });
    }
  }, [user, profile]);

  // Fetch co-parent invites when user changes
  useEffect(() => {
    if (user) {
      fetchInvites();
    }
  }, [user]);

  const fetchInvites = useCallback(async () => {
    try {
      if (!user) {
        console.log("Cannot fetch invites: No user logged in");
        return;
      }
      
      setLoading(true);
      console.log("Fetching invites for user ID:", user.id);
      
      // Query co_parent_invites where the current user is the inviter
      const { data, error } = await supabase
        .from('co_parent_invites')
        .select('*')
        .eq('invited_by', user.id);
        
      if (error) {
        console.error('Error fetching invites:', error);
        toast.error("Failed to load co-parent invites");
        setLoading(false);
        return;
      }
      
      console.log("Fetched invites:", data);
      
      if (data) {
        setInvites(data.map((invite) => ({
          id: invite.id,
          email: invite.email,
          status: invite.status as any,
          invitedBy: invite.invited_by,
          invitedAt: invite.invited_at,
          message: invite.message || undefined,
          respondedAt: invite.responded_at || undefined
        })));
      } else {
        setInvites([]);
      }
    } catch (error) {
      console.error('Error fetching invites:', error);
      toast.error("Failed to load co-parent invites");
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    currentUser,
    invites,
    setInvites,
    loading,
    fetchInvites
  };
};
