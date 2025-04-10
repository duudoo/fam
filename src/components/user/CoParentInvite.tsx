
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

// Define the form schema with zod
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CoParentInviteProps {
  onSubmit: (email: string, message?: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CoParentInvite = ({ onSubmit, onCancel, isSubmitting = false }: CoParentInviteProps) => {
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const submitting = isSubmitting || localSubmitting;
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      message: "I'd like to invite you to join Famacle as a co-parent to manage our shared parenting responsibilities.",
    },
  });

  // Sync external isSubmitting state with local state
  useEffect(() => {
    if (!isSubmitting && localSubmitting) {
      setLocalSubmitting(false);
    }
  }, [isSubmitting, localSubmitting]);

  const handleSubmit = async (data: FormData) => {
    if (submitting) return; // Prevent multiple submissions

    try {
      setLocalSubmitting(true);
      await onSubmit(data.email, data.message);
      // Form will be reset by parent component after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
      // Parent component will handle error display
    } finally {
      setLocalSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Co-Parent's Email *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="email@example.com" 
                  {...field} 
                  autoFocus
                  type="email"
                  disabled={submitting}
                />
              </FormControl>
              <FormDescription>
                Your co-parent will receive an email invitation to join Famacle
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invitation Message (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add a personal message to your invitation" 
                  {...field} 
                  rows={3}
                  disabled={submitting}
                />
              </FormControl>
              <FormDescription>
                This message will be included in the email invitation sent to the co-parent.
              </FormDescription>
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
                Sending...
              </>
            ) : (
              'Send Invitation'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CoParentInvite;
