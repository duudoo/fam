
import { useQuery } from "@tanstack/react-query";
import { expensesAPI } from "@/lib/api/expenses";
import { Expense, ExpenseCategory, ExpenseStatus } from "@/utils/types";

export const useExpenseQueries = (
  userId: string | undefined,
  statusFilter: ExpenseStatus | "all" = "all",
  categoryFilter: ExpenseCategory | "all" = "all",
  searchQuery: string = ""
) => {
  const fetchExpenses = async () => {
    if (!userId) return [];

    console.log("Fetching expenses with filters:", { statusFilter, categoryFilter, searchQuery });
    
    try {
      return await expensesAPI.getExpenses(userId, statusFilter, categoryFilter, searchQuery);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['expenses', userId, statusFilter, categoryFilter, searchQuery],
    queryFn: fetchExpenses,
    enabled: !!userId,
    initialData: [],
  });
};
