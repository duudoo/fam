
import { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from 'react-hook-form';
import { ExpenseCategory } from '@/utils/types';
import { FormValues } from '../schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useExpenseCategories } from '@/hooks/useExpenseCategories';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface CategoryFieldProps {
  form: UseFormReturn<FormValues, any, undefined>;
  categories: ExpenseCategory[];
}

export const CategoryField = ({ form, categories }: CategoryFieldProps) => {
  const [newCategory, setNewCategory] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { addCategory } = useExpenseCategories();

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    const result = await addCategory(newCategory);
    if (result) {
      // Set the newly added category as the selected value
      form.setValue('category', result as ExpenseCategory);
      setNewCategory('');
      setIsPopoverOpen(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>Category</FormLabel>
          <div className="flex gap-2">
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  className="flex-shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add new category</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Add New Category</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Category name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleAddCategory} 
                      disabled={!newCategory.trim()}
                      type="button"
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
