
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
  const [error, setError] = useState<string | null>(null);

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
        setInvites([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      console.log("Fetching invites for user ID:", user.id);
      
      // Fixed: Query co_parent_invites directly without joining to users
      const { data, error } = await supabase
        .from('co_parent_invites')
        .select('*')
        .eq('invited_by', user.id);
        
      if (error) {
        console.error('Error fetching invites:', error);
        setError("Unable to load co-parent invites");
        toast.error("Failed to load co-parent invites");
        setInvites([]);
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
        setError(null);
      } else {
        setInvites([]);
      }
    } catch (error) {
      console.error('Error fetching invites:', error);
      setError("Unable to load co-parent invites");
      toast.error("Failed to load co-parent invites");
      setInvites([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createInvite = useCallback(async (email: string, message?: string) => {
    try {
      if (!user) {
        return { error: "You must be signed in to send invitations" };
      }
      
      // Validate the email is not the current user's email
      if (user.email === email) {
        return { error: "You cannot invite yourself" };
      }
      
      // Check existing invites from local state first to improve UX
      const existingInvite = invites.find(invite => invite.email.toLowerCase() === email.toLowerCase());
      if (existingInvite) {
        return { error: "You have already invited this email address" };
      }

      console.log("Creating invitation for:", email);
      
      // Try to create the invitation
      const { data: newInvite, error: inviteError } = await supabase
        .from('co_parent_invites')
        .insert({
          email: email,
          invited_by: user.id,
          status: 'pending',
          message: message || null
        })
        .select();
      
      if (inviteError) {
        // Check specific error codes
        if (inviteError.code === '23505') {
          return { error: "This email has already been invited" };
        }
        console.error("Error creating invitation:", inviteError);
        return { error: "Failed to create invitation" };
      }
      
      if (!newInvite || newInvite.length === 0) {
        return { error: "Failed to create invitation record" };
      }
      
      // If successful, refresh the invites list
      await fetchInvites();
      
      return { 
        data: {
          id: newInvite[0].id,
          email: newInvite[0].email,
          status: newInvite[0].status as any,
          invitedBy: newInvite[0].invited_by,
          invitedAt: newInvite[0].invited_at,
          message: newInvite[0].message || undefined,
        }
      };
    } catch (error) {
      console.error("Error creating invitation:", error);
      return { error: "Failed to create invitation" };
    }
  }, [user, invites, fetchInvites]);

  return {
    currentUser,
    invites,
    setInvites,
    loading,
    error,
    fetchInvites,
    createInvite
  };
};
