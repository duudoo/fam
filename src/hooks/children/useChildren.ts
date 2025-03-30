
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Child } from '@/utils/types';

export const useChildren = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['children', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: parentChildrenData, error: pcError } = await supabase
        .from('parent_children')
        .select('child_id')
        .eq('parent_id', user.id);
        
      if (pcError) throw pcError;
      
      if (!parentChildrenData || parentChildrenData.length === 0) return [];
      
      const childIds = parentChildrenData.map(pc => pc.child_id);
      
      const { data: childrenData, error: childrenError } = await supabase
        .from('children')
        .select('*')
        .in('id', childIds);
        
      if (childrenError) throw childrenError;
      
      if (!childrenData) return [];
      
      return childrenData.map(child => ({
        id: child.id,
        name: child.name || undefined,
        dateOfBirth: child.date_of_birth || undefined,
        initials: child.initials,
        parentIds: [user.id] // We only have the current parent's ID
      }));
    },
    enabled: !!user,
  });
};
