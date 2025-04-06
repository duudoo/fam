
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getUserExpenseCategories, addExpenseCategory, deleteExpenseCategory } from '@/lib/api/expenseCategories';
import { toast } from 'sonner';

export const useExpenseCategories = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state on component mount
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await getUserExpenseCategories(user.id);
      
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
        setCategories(['education', 'healthcare', 'clothing', 'activities', 'other']);
      }
    } finally {
      if (isMounted) {
        // Small delay to prevent UI flicker
        setTimeout(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        }, 300);
      }
    }
  };

  const addCategory = async (newCategory: string) => {
    if (!user) return null;
    if (!newCategory.trim()) return null;

    try {
      await addExpenseCategory(user.id, newCategory.trim());
      
      // Add the new category to the local state immediately
      const formattedCategory = newCategory.trim().toLowerCase();
      setCategories(prev => {
        if (!prev.includes(formattedCategory)) {
          return [...prev, formattedCategory].sort();
        }
        return prev;
      });
      
      // Still refetch to ensure consistency with server
      setTimeout(() => fetchCategories(), 500);
      
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
      await deleteExpenseCategory(user.id, category);
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
