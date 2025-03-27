
import { useQuery } from '@tanstack/react-query';
import { expensesAPI } from '@/lib/api/expenses';
import { ExpenseCategory, ExpenseStatus } from '@/utils/types';

export const useExpenseQueries = (
  userId?: string,
  filter: ExpenseStatus | 'all' = 'all',
  categoryFilter: ExpenseCategory | 'all' = 'all',
  searchQuery: string = ''
) => {
  return useQuery({
    queryKey: ['expenses', userId, filter, categoryFilter, searchQuery],
    queryFn: () => {
      if (!userId) return [];
      return expensesAPI.getExpenses(userId, filter, categoryFilter, searchQuery);
    },
    enabled: !!userId,
  });
};
