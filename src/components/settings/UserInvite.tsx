
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
import { useFamilyCircle } from '@/hooks/useFamilyCircle';
import { AlertCircle } from 'lucide-react';

const inviteFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  })
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

interface UserInviteProps {
  onInviteSent?: () => void;
}

const UserInvite = ({ onInviteSent }: UserInviteProps) => {
  const { createInvite } = useFamilyCircle();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const sendInvite = async (data: InviteFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const result = await createInvite(data.email);
      
      if (result.error) {
        setErrorMessage(result.error);
        toast.error(result.error);
        return;
      }
      
      toast.success("Invitation sent successfully");
      form.reset();
      
      if (onInviteSent) {
        onInviteSent();
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      setErrorMessage("Failed to send invitation. Please try again later.");
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

        {errorMessage && (
          <div className="flex items-center gap-2 text-sm text-red-500 mt-2">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>
    </Form>
  );
};

export default UserInvite;
