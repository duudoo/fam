
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Child } from '@/utils/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useChildren = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('children')
        .select(`
          id,
          name,
          date_of_birth,
          initials,
          parent_children!inner (parent_id)
        `)
        .eq('parent_children.parent_id', user?.id);

      if (error) throw error;

      if (data) {
        const mappedChildren: Child[] = data.map((child) => ({
          id: child.id,
          name: child.name || undefined,
          dateOfBirth: child.date_of_birth || undefined,
          initials: child.initials,
          parentIds: child.parent_children.map(pc => pc.parent_id)
        }));
        
        setChildren(mappedChildren);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      toast.error("Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  return {
    children,
    loading,
    fetchChildren
  };
};
