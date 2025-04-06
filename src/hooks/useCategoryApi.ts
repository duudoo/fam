
import { useCallback } from 'react';
import { 
  getUserExpenseCategories, 
  addExpenseCategory, 
  deleteExpenseCategory 
} from '@/lib/api/expenseCategories';

/**
 * Hook providing API functions for expense categories
 */
export const useCategoryApi = () => {
  const fetchUserCategories = useCallback(async (userId: string) => {
    return await getUserExpenseCategories(userId);
  }, []);

  const addUserCategory = useCallback(async (userId: string, category: string) => {
    return await addExpenseCategory(userId, category);
  }, []);

  const removeUserCategory = useCallback(async (userId: string, category: string) => {
    return await deleteExpenseCategory(userId, category);
  }, []);

  return {
    fetchUserCategories,
    addUserCategory,
    removeUserCategory
  };
};
