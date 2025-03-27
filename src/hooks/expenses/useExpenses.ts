
import { useAuth } from "@/hooks/useAuth";
import { useExpenseFilters } from "./useExpenseFilters";
import { useExpenseQueries } from "./useExpenseQueries";
import { useExpenseMutations } from "./useExpenseMutations";
import { useExpenseSubscription } from "./useExpenseSubscription";

export const useExpenses = () => {
  const { user } = useAuth();
  
  // Get filters
  const { 
    filter, 
    setFilter, 
    categoryFilter, 
    setCategoryFilter, 
    searchQuery, 
    setSearchQuery 
  } = useExpenseFilters();
  
  // Get queries
  const expenseQuery = useExpenseQueries(
    user?.id, 
    filter, 
    categoryFilter, 
    searchQuery
  );
  
  // Get mutations
  const { 
    createExpense, 
    updateExpense, 
    deleteExpense, 
    isPending 
  } = useExpenseMutations(user?.id);
  
  // Get subscription
  const { subscribeToExpenses } = useExpenseSubscription(user?.id);

  return {
    // Data
    expenses: expenseQuery.data,
    isLoading: expenseQuery.isLoading,
    
    // Filters
    filter,
    setFilter,
    categoryFilter, 
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    
    // Mutations
    createExpense,
    updateExpense,
    deleteExpense,
    isPending,
    
    // Subscription
    subscribeToExpenses
  };
};
