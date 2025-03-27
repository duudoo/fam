
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ExpenseCategory } from '@/utils/types';

interface CategorySummary {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export const useMonthlySummary = () => {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMonthlySummary();
    }
  }, [user]);

  const fetchMonthlySummary = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get the start and end dates for the current month
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      
      // Fetch expenses for the current month
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);
        
      if (error) throw error;
      
      // Process the data to get totals by category
      const categoryTotals: Record<string, number> = {};
      let totalAmount = 0;
      
      if (data && data.length > 0) {
        data.forEach(expense => {
          const category = expense.category as ExpenseCategory;
          const amount = parseFloat(expense.amount);
          
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
          totalAmount += amount;
        });
        
        // Convert to array format with percentages
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
        
        // Sort by amount (highest first)
        categoriesArray.sort((a, b) => b.amount - a.amount);
        
        setCategories(categoriesArray);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading };
};
