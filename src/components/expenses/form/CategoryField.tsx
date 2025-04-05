
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { FormValues } from "./schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExpenseCategory } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface CategoryFieldProps {
  control: Control<FormValues>;
}

const DEFAULT_CATEGORIES: ExpenseCategory[] = [
  'medical',
  'education',
  'clothing',
  'activities',
  'food',
];

const CategoryField = ({ control }: CategoryFieldProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Try to fetch user's custom categories
        const { data, error } = await supabase
          .from('user_expense_categories')
          .select('category')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        // Combine default categories with user's custom categories if any
        const userCategories = data?.map(item => item.category) || [];
        const allCategories = [...DEFAULT_CATEGORIES, ...userCategories.filter(c => 
          !DEFAULT_CATEGORIES.includes(c as ExpenseCategory)
        )];
        
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [user]);
  
  return (
    <FormField
      control={control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category">
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading...</span>
                    </div>
                  ) : field.value}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategoryField;
