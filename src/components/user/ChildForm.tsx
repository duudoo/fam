
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Child } from "@/utils/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Define the form schema with zod
const formSchema = z.object({
  initials: z.string()
    .min(1, "Initials are required")
    .max(3, "Initials should be at most 3 characters"),
  name: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ChildFormProps {
  onSubmit: (data: Omit<Child, "id" | "parentIds">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ChildForm = ({ onSubmit, onCancel, isSubmitting = false }: ChildFormProps) => {
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const submitting = isSubmitting || localSubmitting;
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initials: "",
      name: "",
      dateOfBirth: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    if (submitting) return; // Prevent multiple submissions
    
    setLocalSubmitting(true);
    try {
      // Convert initials to uppercase and handle optional fields
      const childData = {
        initials: data.initials.toUpperCase(),
        name: data.name || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
      };
      
      // Call the onSubmit prop with the prepared data
      await onSubmit(childData);
      
      // Reset form on successful submission
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to add child. Please try again.');
    } finally {
      setLocalSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="initials"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initials *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. JD" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  autoFocus
                  maxLength={3}
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. Jane Doe" 
                  {...field} 
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : "Add Child"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChildForm;
