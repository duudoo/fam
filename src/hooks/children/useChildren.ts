
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Child } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook to fetch children data
 */
export const useChildren = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['children', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Query children associated with the current user
      const { data: parentChildrenData, error: relationError } = await supabase
        .from('parent_children')
        .select('child_id')
        .eq('parent_id', user.id);
      
      if (relationError) {
        console.error("Error fetching parent-child relations:", relationError);
        throw relationError;
      }
      
      // If no children found, return empty array
      if (!parentChildrenData || parentChildrenData.length === 0) {
        return [];
      }
      
      // Extract child IDs
      const childIds = parentChildrenData.map(rel => rel.child_id);
      
      // Fetch the actual child records
      const { data: childrenData, error: childrenError } = await supabase
        .from('children')
        .select('*')
        .in('id', childIds);
      
      if (childrenError) {
        console.error("Error fetching children:", childrenError);
        throw childrenError;
      }
      
      // Map database model to application model
      return (childrenData || []).map(child => ({
        id: child.id,
        name: child.name || null,
        initials: child.initials,
        dateOfBirth: child.date_of_birth || null,
        parentIds: [user.id] // For now, just include the current user
      })) as Child[];
    },
    enabled: !!user, // Only run query if user is authenticated
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};
