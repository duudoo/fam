
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchSentInvites, fetchReceivedInvites } from '@/lib/api/invites';
import { CoParentInvite } from '@/utils/types';
import { toast } from 'sonner';

export const useFamilyCircle = () => {
  const { user } = useAuth();
  const [invites, setInvites] = useState<CoParentInvite[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<CoParentInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvites = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    let hasError = false;

    try {
      // Fetch invites sent by the current user
      const sentInvitesData = await fetchSentInvites(user.id);
      setInvites(sentInvitesData);
    } catch (err) {
      console.error('Failed to fetch sent invites:', err);
      hasError = true;
    }

    try {
      // Fetch invites received by the current user
      if (user.email) {
        const receivedInvitesData = await fetchReceivedInvites(user.email);
        setReceivedInvites(receivedInvitesData);
      }
    } catch (err) {
      console.error('Failed to fetch received invites:', err);
      hasError = true;
    }

    if (hasError) {
      setError('Failed to load some invitation data. Please try again.');
      toast.error('Error loading invitation data');
    }
    
    setLoading(false);
  }, [user]);

  // Load invites when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchInvites();
    } else {
      setLoading(false);
    }
  }, [user, fetchInvites]);

  return {
    currentUser: user,
    invites,
    receivedInvites,
    loading,
    error,
    fetchInvites,
  };
};
