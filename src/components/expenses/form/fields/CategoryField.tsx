
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { useExpenseCategories } from "@/hooks/useExpenseCategories";
import { Spinner } from "@/components/ui/spinner";

interface CategoryFieldProps {
  control: Control<any>;
  required?: boolean;
  description?: string;
}

const CategoryField = ({ control, required = true, description }: CategoryFieldProps) => {
  const { categories, isLoading } = useExpenseCategories();
  
  // Capitalize first letter of category
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <FormField
      control={control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category {required && <span className="text-red-500">*</span>}</FormLabel>
          <FormControl>
            <Select 
              disabled={isLoading} 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              value={field.value}
            >
              <SelectTrigger className="w-full">
                {isLoading ? (
                  <div className="flex items-center">
                    <Spinner size="sm" className="mr-2" />
                    <span>Loading...</span>
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
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategoryField;
