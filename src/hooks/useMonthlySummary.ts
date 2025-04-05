import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ExpenseCategory, Child } from '@/utils/types';
import { useChildren } from '@/hooks/children';

interface CategorySummary {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface ChildCategorySummary {
  [childId: string]: CategorySummary[];
}

interface ChildExpenses {
  [childId: string]: number;
}

export const useMonthlySummary = () => {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [categoryByChild, setCategoryByChild] = useState<ChildCategorySummary>({});
  const [expensesByChild, setExpensesByChild] = useState<ChildExpenses>({});
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { data: childrenData } = useChildren();

  useEffect(() => {
    if (childrenData) {
      setChildren(childrenData);
    }
  }, [childrenData]);

  useEffect(() => {
    if (user) {
      fetchMonthlySummary();
    }
  }, [user, children]);

  const getChildAllocation = (expense: any, childId: string, childCount: number): number => {
    if (expense.child_split_amounts && expense.child_split_amounts[childId]) {
      return parseFloat(expense.child_split_amounts[childId]);
    }
    
    return parseFloat(expense.amount) / childCount;
  };

  const fetchMonthlySummary = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*, expense_children(child_id)')
        .gte('date', startDate)
        .lte('date', endDate);
        
      if (error) throw error;
      
      const categoryTotals: Record<string, number> = {};
      const childCategoryTotals: Record<string, Record<string, number>> = {};
      const childTotalAmounts: Record<string, number> = {};
      const childExpensesTotal: Record<string, number> = {};
      let totalAmount = 0;
      
      if (data && data.length > 0) {
        data.forEach(expense => {
          const category = expense.category as ExpenseCategory;
          const amount = parseFloat(expense.amount);
          const childExpenses = expense.expense_children || [];
          
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
          totalAmount += amount;
          
          if (childExpenses.length > 0) {
            childExpenses.forEach((childExp: any) => {
              const childId = childExp.child_id;
              
              if (!childCategoryTotals[childId]) {
                childCategoryTotals[childId] = {};
              }
              
              const childAmount = getChildAllocation(expense, childId, childExpenses.length);
              
              childCategoryTotals[childId][category] = 
                (childCategoryTotals[childId][category] || 0) + childAmount;
              
              childTotalAmounts[childId] = (childTotalAmounts[childId] || 0) + childAmount;
              childExpensesTotal[childId] = (childExpensesTotal[childId] || 0) + childAmount;
            });
          }
        });
        
        const categoryColors: Record<string, string> = {
          medical: 'bg-red-500',
          education: 'bg-blue-500',
          clothing: 'bg-purple-500',
          activities: 'bg-green-500',
          food: 'bg-yellow-500',
          other: 'bg-gray-500'
        };
        
        const categoriesArray: CategorySummary[] = Object.keys(categoryTotals).map(category => ({
          name: category.charAt(0).toUpperCase() + category.slice(1),
          amount: categoryTotals[category],
          percentage: totalAmount > 0 ? (categoryTotals[category] / totalAmount) * 100 : 0,
          color: categoryColors[category] || 'bg-gray-500'
        }));
        
        categoriesArray.sort((a, b) => b.amount - a.amount);
        
        const childCategories: ChildCategorySummary = {};
        
        Object.keys(childCategoryTotals).forEach(childId => {
          const childCategories: CategorySummary[] = Object.keys(childCategoryTotals[childId]).map(category => ({
            name: category.charAt(0).toUpperCase() + category.slice(1),
            amount: childCategoryTotals[childId][category],
            percentage: childTotalAmounts[childId] > 0 
              ? (childCategoryTotals[childId][category] / childTotalAmounts[childId]) * 100 
              : 0,
            color: categoryColors[category] || 'bg-gray-500'
          }));
          
          childCategories.sort((a, b) => b.amount - a.amount);
          
          if (!childCategoryTotals[childId]) {
            childCategoryTotals[childId] = {};
          }
        });
        
        setCategories(categoriesArray);
        setCategoryByChild(childCategories);
        setExpensesByChild(childExpensesTotal);
      } else {
        setCategories([]);
        setCategoryByChild({});
        setExpensesByChild({});
      }
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
      setCategories([]);
      setCategoryByChild({});
      setExpensesByChild({});
    } finally {
      setLoading(false);
    }
  };

  return { categories, categoryByChild, children, loading, expensesByChild };
};
