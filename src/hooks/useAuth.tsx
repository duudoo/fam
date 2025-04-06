
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api/auth';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Fetch user profile data
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      setProfileLoading(true);
      setProfileError(null);
      const data = await authAPI.getUserProfile(userId);
      setProfile(data);
      return data;
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error);
      setProfileError(error.message || 'Failed to load profile');
      // Still return a minimal profile with just the ID so the app can function
      return {
        id: userId,
        email: user?.email || '',
      };
    } finally {
      setProfileLoading(false);
    }
  }, [user]);

  // Update user profile data
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedProfile = await authAPI.updateUserProfile(user.id, updates);
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast.success('Profile updated successfully');
      return updatedProfile;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
      return null;
    }
  };

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    let mounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = authAPI.onAuthStateChange(
      (event: string, session: Session | null) => {
        console.log("Auth state changed:", event, session);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // If user logged in, fetch their profile
        if (session?.user && mounted) {
          // Use setTimeout to avoid potential recursive issues
          setTimeout(() => {
            if (mounted) {
              fetchUserProfile(session.user.id);
            }
          }, 0);
        } else if (!session && mounted) {
          setProfile(null);
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    authAPI.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // If user is already logged in, fetch their profile
      if (session?.user && mounted) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    }).catch(error => {
      console.error("Error checking session:", error);
      if (mounted) {
        setLoading(false);
      }
    });

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up auth subscription");
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signOut = async () => {
    try {
      await authAPI.signOut();
      setProfile(null);
      console.log("User signed out");
      toast.success("Signed out successfully");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to sign out");
    }
  };

  return {
    user,
    session,
    profile,
    profileError,
    loading,
    profileLoading,
    signOut,
    updateUserProfile,
    refreshProfile: () => user ? fetchUserProfile(user.id) : Promise.resolve(null),
  };
};

export default useAuth;
