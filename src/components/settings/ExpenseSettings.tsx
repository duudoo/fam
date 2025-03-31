import { useState } from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormDescription,
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { SplitMethod, ExpenseCategory } from '@/utils/types';
import { useExpenseCategories } from '@/hooks/useExpenseCategories';
import { Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const splitMethods: SplitMethod[] = [
  'none',
  '50/50',
  'custom'
];

// Default expense categories that all users have access to
const defaultCategories: ExpenseCategory[] = [
  'medical',
  'education',
  'clothing',
  'activities',
  'food'
];

const expenseFormSchema = z.object({
  defaultSplitMethod: z.string({
    required_error: "Please select a default split method",
  })
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

const ExpenseSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const { 
    categories: userCategories, 
    isLoading: categoriesLoading, 
    addCategory, 
    deleteCategory 
  } = useExpenseCategories();
  
  // For now, default to 50/50. In a real app, this would be loaded from user preferences
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      defaultSplitMethod: '50/50',
    },
  });

  const onSubmit = async (data: ExpenseFormValues) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Expense settings updated");
      setIsLoading(false);
    }, 1000);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    const result = await addCategory(newCategory);
    if (result) {
      setNewCategory('');
    }
  };

  const handleDeleteCategory = async (category: string) => {
    // Don't allow deleting default categories
    if (defaultCategories.includes(category as ExpenseCategory)) {
      toast.error(`Cannot delete default category "${category}"`);
      return;
    }
    
    // Confirm before deleting
    if (window.confirm(`Are you sure you want to delete the "${category}" category?`)) {
      await deleteCategory(category);
    }
  };

  // Check if a category is a default category
  const isDefaultCategory = (category: string) => 
    defaultCategories.includes(category as ExpenseCategory);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Expense Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Configure your default expense settings
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="defaultSplitMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Split Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default split method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {splitMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method === '50/50' ? '50/50 Split' : 
                         method === 'custom' ? 'Custom Split Ratio' : 
                         'No Split'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  This will be the default split method when creating new expenses.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
            Save Expense Settings
          </Button>
        </form>
      </Form>
      
      <Separator className="my-6" />
      
      <div>
        <h3 className="text-lg font-medium">Expense Categories</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage the categories available when creating expenses
        </p>
        
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleAddCategory} 
            disabled={!newCategory.trim() || categoriesLoading}
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        
        {categoriesLoading ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="mb-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Default Categories</h4>
              <div className="flex flex-wrap gap-2">
                {defaultCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="py-2 px-3 capitalize flex items-center gap-1">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Custom Categories</h4>
              <div className="flex flex-wrap gap-2">
                {userCategories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No custom categories yet. Add some above!</p>
                ) : (
                  userCategories
                    .filter(category => !isDefaultCategory(category))
                    .map((category) => (
                      <Badge key={category} variant="outline" className="py-2 px-3 capitalize flex items-center gap-1">
                        {category}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 ml-1 p-0 text-gray-500 hover:text-red-500"
                          onClick={() => handleDeleteCategory(category)}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Delete {category}</span>
                        </Button>
                      </Badge>
                    ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseSettings;
