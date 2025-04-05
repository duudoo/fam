
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
import { useFamilyCircle } from "@/hooks/useFamilyCircle";
import { toast } from "sonner";
import { emailAPI } from "@/lib/api/email";

// Define the form schema with zod
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CoParentInviteFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  compact?: boolean;
  defaultMessage?: string;
}

const CoParentInviteForm = ({ 
  onSuccess, 
  onCancel, 
  compact = false,
  defaultMessage = "I'd like to invite you to join as a co-parent to manage our shared parenting responsibilities."
}: CoParentInviteFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createInvite, currentUser } = useFamilyCircle();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      message: defaultMessage,
    },
  });

  const handleSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const result = await createInvite(data.email, data.message);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      // If we have invite data and currentUser, send email invitation
      if (result.data && currentUser) {
        try {
          const inviteLink = `${window.location.origin}/accept-invite?id=${result.data.id}`;
          
          await emailAPI.sendCoParentInviteEmail(
            data.email, 
            currentUser.name || 'A co-parent', 
            data.message || '',
            inviteLink
          );
        } catch (emailError) {
          console.error("Error sending invitation email:", emailError);
          toast.warning("Invitation created but email notification might not have been sent.");
        }
      }
      
      toast.success(`Invitation sent to ${data.email}`);
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation. Please try again later.");
    } finally {
      setIsSubmitting(false);
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
              <FormLabel>Co-Parent Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="email@example.com" 
                  {...field} 
                  autoFocus
                  type="email"
                  disabled={isSubmitting}
                />
              </FormControl>
              {!compact && (
                <FormDescription>
                  Your co-parent will receive an email invitation
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!compact && (
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
        )}
        
        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
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
  );
};

export default CoParentInviteForm;
