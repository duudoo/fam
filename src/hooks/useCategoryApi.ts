
import { useCallback, useMemo } from 'react';
import { 
  getUserExpenseCategories, 
  addExpenseCategory, 
  deleteExpenseCategory 
} from '@/lib/api/expenseCategories';

/**
 * Hook providing API functions for expense categories
 */
export const useCategoryApi = () => {
  // Use useCallback to memoize these functions
  const fetchUserCategories = useCallback(async (userId: string) => {
    if (!userId) return [];
    console.log('Fetching categories for user:', userId);
    return await getUserExpenseCategories(userId);
  }, []);

  const addUserCategory = useCallback(async (userId: string, category: string) => {
    if (!userId || !category) return null;
    console.log('Adding category for user:', userId, category);
    return await addExpenseCategory(userId, category);
  }, []);

  const removeUserCategory = useCallback(async (userId: string, category: string) => {
    if (!userId || !category) return false;
    console.log('Removing category for user:', userId, category);
    return await deleteExpenseCategory(userId, category);
  }, []);

  // Memoize the returned object to prevent unnecessary re-renders
  return useMemo(() => ({
    fetchUserCategories,
    addUserCategory,
    removeUserCategory
  }), [fetchUserCategories, addUserCategory, removeUserCategory]);
};
