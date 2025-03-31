
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useExpenseCategories } from '@/hooks/useExpenseCategories';
import { ExpenseCategory } from '@/utils/types';

// Default expense categories that all users have access to
const defaultCategories: ExpenseCategory[] = [
  'medical',
  'education',
  'clothing',
  'activities',
  'food'
];

export const CategoryManager = () => {
  const [newCategory, setNewCategory] = useState('');
  const { 
    categories: userCategories, 
    isLoading: categoriesLoading, 
    addCategory, 
    deleteCategory 
  } = useExpenseCategories();

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
          <DefaultCategories categories={defaultCategories} />
          <CustomCategories 
            categories={userCategories} 
            isDefaultCategory={isDefaultCategory}
            onDelete={handleDeleteCategory}
          />
        </>
      )}
    </div>
  );
};

interface CategoryListProps {
  categories: string[];
  isDefaultCategory?: (category: string) => boolean;
  onDelete?: (category: string) => Promise<void>;
}

const DefaultCategories = ({ categories }: CategoryListProps) => (
  <div className="mb-2">
    <h4 className="text-sm font-medium text-muted-foreground mb-2">Default Categories</h4>
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Badge key={category} variant="secondary" className="py-2 px-3 capitalize flex items-center gap-1">
          {category}
        </Badge>
      ))}
    </div>
  </div>
);

const CustomCategories = ({ categories, isDefaultCategory, onDelete }: CategoryListProps) => {
  const customCategories = categories.filter(category => !isDefaultCategory?.(category));
  
  if (customCategories.length === 0) {
    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Custom Categories</h4>
        <p className="text-sm text-muted-foreground">No custom categories yet. Add some above!</p>
      </div>
    );
  }
  
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-muted-foreground mb-2">Custom Categories</h4>
      <div className="flex flex-wrap gap-2">
        {customCategories.map((category) => (
          <Badge key={category} variant="outline" className="py-2 px-3 capitalize flex items-center gap-1">
            {category}
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 ml-1 p-0 text-gray-500 hover:text-red-500"
              onClick={() => onDelete?.(category)}
            >
              <Trash2 className="h-3 w-3" />
              <span className="sr-only">Delete {category}</span>
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
