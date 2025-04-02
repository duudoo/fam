
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExpenseCategories } from "@/hooks/useExpenseCategories";

const STANDARD_CATEGORIES = [
  { id: "education", label: "Education" },
  { id: "medical", label: "Medical" },
  { id: "clothing", label: "Clothing" },
  { id: "activities", label: "Activities" },
  { id: "food", label: "Food" },
];

interface CategoryFieldProps {
  form: any;
}

const CategoryField = ({ form }: CategoryFieldProps) => {
  const { isLoading, categories = [] } = useExpenseCategories();
  
  // Combine standard and custom categories
  const allCategories = [
    ...STANDARD_CATEGORIES,
    ...categories
      .filter(c => !STANDARD_CATEGORIES.some(sc => sc.id === c.category))
      .map(c => ({ 
        id: c.category, 
        label: c.category.charAt(0).toUpperCase() + c.category.slice(1) 
      }))
  ];
  
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {allCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
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
