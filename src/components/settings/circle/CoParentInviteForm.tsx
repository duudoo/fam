
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

// Define the form schema with zod
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CoParentInviteFormProps {
  onSubmit: (email: string, message?: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CoParentInviteForm = ({ onSubmit, onCancel, isSubmitting = false }: CoParentInviteFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      message: "I'd like to invite you to join as a co-parent to manage our shared parenting responsibilities.",
    },
  });

  const handleSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    await onSubmit(data.email, data.message);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
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
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Your co-parent will receive an email invitation
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
                  <FormLabel>Personal Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a personal message to your invitation" 
                      {...field} 
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    This message will be included in the email invitation
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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
      </CardContent>
    </Card>
  );
};

export default CoParentInviteForm;
