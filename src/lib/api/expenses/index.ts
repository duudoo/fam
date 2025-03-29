
import { getExpenses } from './getExpenses';
import { 
  createExpense, 
  updateExpense, 
  deleteExpense, 
  updateExpenseStatus 
} from './mutateExpenses';
import { subscribeToExpenses } from './subscribeExpenses';

export const expensesAPI = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  updateExpenseStatus,
  subscribeToExpenses
};
