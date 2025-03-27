
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/utils/types";

export const authAPI = {
  /**
   * Get the current user session
   */
  getSession: async () => {
    return await supabase.auth.getSession();
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    return await supabase.auth.signOut();
  },

  /**
   * Get user profile
   */
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  },

  /**
   * Update user profile
   */
  updateUserProfile: async (userId: string, updates: Partial<UserProfile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  },

  /**
   * Set up authentication state listener
   */
  onAuthStateChange: (callback: Function) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};
