
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch all expense categories for the current user
 */
export const getUserExpenseCategories = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_expense_categories')
    .select('*')
    .eq('user_id', userId)
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching expense categories:', error);
    throw error;
  }

  return data.map(item => item.category);
};

/**
 * Add a new expense category for the current user
 */
export const addExpenseCategory = async (userId: string, category: string) => {
  const { data, error } = await supabase
    .from('user_expense_categories')
    .insert({ 
      user_id: userId, 
      category: category.trim().toLowerCase() 
    })
    .select()
    .single();

  if (error) {
    // If the category already exists, just return it
    if (error.code === '23505') { // Unique violation
      return { category };
    }
    console.error('Error adding expense category:', error);
    throw error;
  }

  return data;
};

/**
 * Delete an expense category for the current user
 */
export const deleteExpenseCategory = async (userId: string, category: string) => {
  const { error } = await supabase
    .from('user_expense_categories')
    .delete()
    .eq('user_id', userId)
    .eq('category', category);

  if (error) {
    console.error('Error deleting expense category:', error);
    throw error;
  }

  return { success: true };
};
