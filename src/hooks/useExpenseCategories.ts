
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useCategoryApi } from './useCategoryApi';
import { toast } from 'sonner';

/**
 * Hook to manage expense categories for the current user
 */
export const useExpenseCategories = () => {
  const { user } = useAuth();
  const { fetchUserCategories, addUserCategory, removeUserCategory } = useCategoryApi();
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state on component mount
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Create a memoized fetchCategories function
  const fetchCategories = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching expense categories for user:', user.id);
      const data = await fetchUserCategories(user.id);
      console.log('Fetched categories:', data);
      
      // Only update state if component is still mounted
      if (isMounted) {
        setCategories(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      if (isMounted) {
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
        // Provide fallback categories in case of error
        setCategories(['education', 'healthcare', 'clothing', 'activities', 'food', 'other']);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }, [user, isMounted, fetchUserCategories]);

  // Fetch categories on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchCategories();
    } else {
      // Reset states when there's no user
      setCategories([]);
      setIsLoading(false);
    }
  }, [user, fetchCategories]);

  const addCategory = async (newCategory: string) => {
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
      
      // Add the new category to the local state immediately for better UX
      setCategories(prev => {
        const updatedCategories = [...prev, formattedCategory].sort();
        console.log('Updated categories:', updatedCategories);
        return updatedCategories;
      });
      
      return formattedCategory;
    } catch (err) {
      console.error('Error adding category:', err);
      toast.error(`Failed to add category: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    }
  };

  const deleteCategory = async (category: string) => {
    if (!user) return false;

    try {
      await removeUserCategory(user.id, category);
      setCategories(prev => prev.filter(c => c !== category));
      toast.success(`Category "${category}" deleted`);
      return true;
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error(`Failed to delete category: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  };

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    addCategory,
    deleteCategory
  };
};
