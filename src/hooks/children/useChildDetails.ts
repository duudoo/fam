
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Child } from '@/utils/types';

export const useChildDetails = (childId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['child', childId],
    queryFn: async () => {
      if (!user || !childId) return null;
      
      // First check if user has access to this child
      const { data: parentChildData, error: pcError } = await supabase
        .from('parent_children')
        .select('*')
        .eq('parent_id', user.id)
        .eq('child_id', childId)
        .single();
        
      if (pcError) {
        // If no parent-child relation found, user doesn't have access
        if (pcError.code === 'PGRST116') {
          return null;
        }
        throw pcError;
      }
      
      // If relation exists, get child details
      const { data: childData, error: childError } = await supabase
        .from('children')
        .select('*')
        .eq('id', childId)
        .single();
        
      if (childError) throw childError;
      
      if (!childData) return null;
      
      // Format return data to match Child type
      return {
        id: childData.id,
        name: childData.name || undefined,
        dateOfBirth: childData.date_of_birth || undefined,
        initials: childData.initials,
        parentIds: [user.id], // We only know about the current parent
        isPrimary: parentChildData.is_primary
      } as Child;
    },
    enabled: !!user && !!childId,
  });
};
