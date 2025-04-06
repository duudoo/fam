
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { useExpenseCategories } from "@/hooks/useExpenseCategories";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CategoryFieldProps {
  control: Control<any>;
  required?: boolean;
  description?: string;
}

const CategoryField = ({ control, required = true, description }: CategoryFieldProps) => {
  const { categories, isLoading, addCategory } = useExpenseCategories();
  const [showLoadingState, setShowLoadingState] = useState(true);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  
  useEffect(() => {
    // Only hide loading state when we have categories and aren't loading
    if (!isLoading && categories.length > 0) {
      const timer = setTimeout(() => {
        setShowLoadingState(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, categories]);
  
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const result = await addCategory(newCategory.trim());
    if (result) {
      setNewCategory("");
      setShowAddNew(false);
      toast.success(`Category "${newCategory}" added successfully`);
    }
  };

  return (
    <FormField
      control={control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category {required && <span className="text-red-500">*</span>}</FormLabel>
          <div className="space-y-2">
            {!showAddNew ? (
              <>
                <FormControl>
                  <Select 
                    disabled={isLoading} 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full h-10">
                      {showLoadingState ? (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-muted-foreground">Loading categories...</span>
                          <Spinner size="sm" />
                        </div>
                      ) : (
                        <SelectValue placeholder="Select a category" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {capitalizeFirstLetter(category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => setShowAddNew(true)}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add New Category
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <Input 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddNewCategory}
                  >
                    Add
                  </Button>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowAddNew(false);
                    setNewCategory("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategoryField;
