
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch all expense categories for the current user
 */
export const getUserExpenseCategories = async (userId: string) => {
  console.log('Fetching expense categories for user:', userId);
  
  try {
    const { data, error } = await supabase
      .from('user_expense_categories')
      .select('*')
      .eq('user_id', userId)
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching expense categories:', error);
      throw error;
    }

    const categories = data.map(item => item.category);
    console.log('Fetched categories count:', categories.length);
    return categories;
  } catch (error) {
    console.error('Exception in getUserExpenseCategories:', error);
    throw error;
  }
};

/**
 * Add a new expense category for the current user
 */
export const addExpenseCategory = async (userId: string, category: string) => {
  const formattedCategory = category.trim().toLowerCase();
  console.log('Adding expense category:', formattedCategory, 'for user:', userId);
  
  try {
    const { data, error } = await supabase
      .from('user_expense_categories')
      .insert({ 
        user_id: userId, 
        category: formattedCategory 
      })
      .select()
      .single();

    if (error) {
      // If the category already exists, just return it
      if (error.code === '23505') { // Unique violation
        console.log('Category already exists, returning existing category');
        return { category: formattedCategory };
      }
      console.error('Error adding expense category:', error);
      throw error;
    }

    console.log('Category added successfully:', data);
    return data;
  } catch (error) {
    console.error('Exception in addExpenseCategory:', error);
    throw error;
  }
};

/**
 * Delete an expense category for the current user
 */
export const deleteExpenseCategory = async (userId: string, category: string) => {
  console.log('Deleting expense category:', category, 'for user:', userId);
  
  try {
    const { error } = await supabase
      .from('user_expense_categories')
      .delete()
      .eq('user_id', userId)
      .eq('category', category);

    if (error) {
      console.error('Error deleting expense category:', error);
      throw error;
    }

    console.log('Category deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Exception in deleteExpenseCategory:', error);
    throw error;
  }
};
