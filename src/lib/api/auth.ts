
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
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        
        // Check if error is due to missing profile
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: (await supabase.auth.getUser()).data.user?.email || '',
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating profile:', createError);
            throw new Error('Authentication Error: Unable to create your user profile');
          }
          
          return newProfile;
        }
        
        throw new Error('Authentication Error: Unable to load your user profile');
      }
      
      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw error;
    }
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
