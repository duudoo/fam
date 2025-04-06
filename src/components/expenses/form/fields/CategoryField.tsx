
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CategoryFieldProps {
  control: Control<any>;
  required?: boolean;
  description?: string;
}

const CategoryField = ({ control, required = true, description }: CategoryFieldProps) => {
  const { categories, isLoading, addCategory } = useExpenseCategories();
  const [showAddNewDialog, setShowAddNewDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsAddingCategory(true);
    try {
      const result = await addCategory(newCategory.trim());
      if (result) {
        setNewCategory("");
        setShowAddNewDialog(false);
        toast.success(`Category "${capitalizeFirstLetter(newCategory)}" added successfully`);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category. Please try again.");
    } finally {
      setIsAddingCategory(false);
    }
  };

  return (
    <>
      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Category {required && <span className="text-red-500">*</span>}</FormLabel>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <FormControl>
                  <Select 
                    disabled={isLoading} 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full h-10">
                      {isLoading ? (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-muted-foreground">Loading categories...</span>
                          <Spinner size="sm" />
                        </div>
                      ) : (
                        <SelectValue placeholder="Select a category" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 && !isLoading ? (
                        <div className="py-2 px-2 text-sm text-muted-foreground text-center">
                          No categories found
                        </div>
                      ) : (
                        categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {capitalizeFirstLetter(category)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 shrink-0"
                onClick={() => setShowAddNewDialog(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />

      <Dialog open={showAddNewDialog} onOpenChange={setShowAddNewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category name"
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddNewCategory();
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowAddNewDialog(false);
                setNewCategory("");
              }}
              disabled={isAddingCategory}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddNewCategory}
              disabled={isAddingCategory}
            >
              {isAddingCategory ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Adding...
                </>
              ) : (
                'Add Category'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryField;
