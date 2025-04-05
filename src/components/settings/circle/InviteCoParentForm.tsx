
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createInvite } from "@/lib/api/invites";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { sendEmailInvite } from "@/utils/inviteUtils";
import { Loader2 } from "lucide-react";

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  message: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteCoParentFormProps {
  currentUser: User;
  onInviteSent: () => void;
  onCancel: () => void;
}

const InviteCoParentForm = ({ currentUser, onInviteSent, onCancel }: InviteCoParentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const handleSubmit = async (values: InviteFormValues) => {
    if (!currentUser?.id) {
      toast.error("You must be logged in to send invitations");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the invitation in the database
      const { data, error } = await createInvite(
        values.email, 
        currentUser.id,
        values.message
      );
      
      if (error) {
        toast.error(error);
        return;
      }
      
      if (data) {
        // Send email invitation
        const inviteResult = await sendEmailInvite({
          email: values.email,
          inviterName: currentUser.user_metadata?.full_name || currentUser.email || "A user",
          inviteMessage: values.message,
          inviteId: data.id
        });
        
        if (inviteResult.success) {
          toast.success(`Invitation sent to ${values.email}`);
          onInviteSent();
        } else {
          toast.error("Invitation created but email could not be sent");
          // Still call onInviteSent because the invitation was created in the database
          onInviteSent();
        }
      }
    } catch (err) {
      console.error("Error sending invitation:", err);
      toast.error("Failed to send invitation. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Co-Parent Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
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
                      placeholder="Add a personal note to your invitation..." 
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-2">
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

export default InviteCoParentForm;
