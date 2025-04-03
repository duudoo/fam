
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const inviteFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  })
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

const UserInvite = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const sendInvite = async (data: InviteFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Validate the email is not the current user's email
      if (user.email === data.email) {
        toast.error("You cannot invite yourself");
        setIsLoading(false);
        return;
      }
      
      // Check if the email is already invited by this user
      const { data: existingInvites, error: checkError } = await supabase
        .from('co_parent_invites')
        .select('id')
        .eq('email', data.email)
        .eq('invited_by', user.id);
      
      if (checkError) {
        console.error("Error checking existing invites:", checkError);
        toast.error("Failed to check existing invitations");
        setIsLoading(false);
        return;
      }
      
      if (existingInvites && existingInvites.length > 0) {
        toast.error("This email has already been invited");
        setIsLoading(false);
        return;
      }
      
      // Create the invitation
      const { error: inviteError } = await supabase
        .from('co_parent_invites')
        .insert({
          email: data.email,
          invited_by: user.id,
          status: 'pending'
        });
      
      if (inviteError) {
        console.error("Error sending invitation:", inviteError);
        toast.error("Failed to send invitation");
        setIsLoading(false);
        return;
      }
      
      toast.success("Invitation sent successfully");
      form.reset();
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(sendInvite)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Co-parent Email</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="Enter co-parent email" {...field} />
                </FormControl>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
                  Send Invite
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default UserInvite;
