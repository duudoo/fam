
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useCategoryApi } from './useCategoryApi';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to manage expense categories for the current user
 */
export const useExpenseCategories = () => {
  const { user } = useAuth();
  const { fetchUserCategories, addUserCategory, removeUserCategory } = useCategoryApi();
  const [error, setError] = useState<Error | null>(null);

  // Use React Query for better caching and preventing unnecessary re-renders
  const { 
    data: categories = [], 
    isLoading,
    refetch: refreshCategories
  } = useQuery({
    queryKey: ['expense-categories', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        console.log('Fetching expense categories for user:', user.id);
        const data = await fetchUserCategories(user.id);
        console.log('Fetched categories:', data);
        return data;
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
        // Provide fallback categories in case of error
        return ['education', 'healthcare', 'clothing', 'activities', 'food', 'other'];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!user
  });

  const addCategory = useCallback(async (newCategory: string) => {
    if (!user) return null;
    if (!newCategory.trim()) return null;

    try {
      const formattedCategory = newCategory.trim().toLowerCase();
      
      // Check if category already exists (case-insensitive)
      if (categories.map(c => c.toLowerCase()).includes(formattedCategory)) {
        toast.info(`Category "${newCategory}" already exists`);
        return formattedCategory;
      }
      
      console.log('Adding new category:', formattedCategory);
      await addUserCategory(user.id, formattedCategory);
      
      // Refresh categories from the server after adding
      refreshCategories();
      
      return formattedCategory;
    } catch (err) {
      console.error('Error adding category:', err);
      toast.error(`Failed to add category: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    }
  }, [user, categories, addUserCategory, refreshCategories]);

  const deleteCategory = useCallback(async (category: string) => {
    if (!user) return false;

    try {
      await removeUserCategory(user.id, category);
      
      // Refresh categories from the server after deletion
      refreshCategories();
      
      toast.success(`Category "${category}" deleted`);
      return true;
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error(`Failed to delete category: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  }, [user, removeUserCategory, refreshCategories]);

  // Memoize the returned object to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    categories,
    isLoading,
    error,
    fetchCategories: refreshCategories,
    addCategory,
    deleteCategory
  }), [categories, isLoading, error, refreshCategories, addCategory, deleteCategory]);

  return returnValue;
};
