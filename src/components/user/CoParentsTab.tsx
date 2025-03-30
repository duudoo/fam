
import { useState } from "react";
import { Plus, Users, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import CoParentInvite from "@/components/user/CoParentInvite";
import CoParentsList from "@/components/user/CoParentsList";
import { CoParentInvite as CoParentInviteType, Parent } from "@/utils/types";
import { emailAPI } from "@/lib/api/email";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Database } from "@/integrations/supabase/database.types";

type Tables = Database['public']['Tables'];
type CoParentInviteRow = Tables['co_parent_invites']['Row'];

interface CoParentsTabProps {
  currentUser: Parent;
  invites: CoParentInviteType[];
  setInvites: React.Dispatch<React.SetStateAction<CoParentInviteType[]>>;
  onInviteSent?: () => void;
}

const CoParentsTab = ({ currentUser, invites, setInvites, onInviteSent }: CoParentsTabProps) => {
  const [addingCoParent, setAddingCoParent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const handleInviteCoParent = async (email: string, message?: string) => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to send invites");
        return;
      }

      // Check if invitation already exists
      const { data: existingInvites, error: checkError } = await supabase
        .from('co_parent_invites')
        .select('*')
        .eq('email', email)
        .eq('invited_by', user.id);
      
      if (checkError) {
        console.error("Error checking existing invites:", checkError);
        throw checkError;
      }
      
      if (existingInvites && existingInvites.length > 0) {
        toast.error("This email has already been invited");
        return;
      }

      // Create the invitation
      const { data: invite, error } = await supabase
        .from('co_parent_invites')
        .insert({
          email,
          invited_by: user.id,
          status: 'pending',
          message: message
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating invitation:", error);
        throw error;
      }

      // Generate invite link
      const inviteLink = `${window.location.origin}/signup?invite=true&email=${encodeURIComponent(email)}`;
      
      // Send invitation email
      try {
        console.log("Sending invitation email to:", email);
        const emailResult = await emailAPI.sendCoParentInviteEmail(
          email, 
          currentUser.name || 'A co-parent', 
          message, 
          inviteLink
        );
        
        if (emailResult?.error) {
          console.error("Failed to send co-parent invitation email:", emailResult.error);
          toast.warning("Invitation created but email delivery failed. The user can still sign up using the invitation link.");
        } else {
          console.log("Co-parent invitation email sent successfully");
        }
      } catch (emailError) {
        console.error("Failed to send co-parent invitation email:", emailError);
        toast.warning("Invitation created but email delivery failed. The user can still sign up using the invitation link.");
      }

      if (invite) {
        // Add new invite to state
        const newInvite: CoParentInviteType = {
          id: invite.id,
          email: invite.email,
          status: invite.status as any,
          invitedBy: invite.invited_by,
          invitedAt: invite.invited_at,
          message: invite.message || undefined,
          respondedAt: invite.responded_at || undefined
        };
        
        setInvites(prev => [...prev, newInvite]);
        setShowSuccess(email);
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(null);
        }, 5000);
      }

      setAddingCoParent(false);
      toast.success(`Invitation sent to ${email}`);
      onInviteSent?.();
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error("Failed to send invitation");
      // Don't close the form on error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-famacle-slate">Co-Parents</h2>
        <Button onClick={() => setAddingCoParent(true)}>
          <Plus className="mr-2 h-4 w-4" /> Invite Co-Parent
        </Button>
      </div>
      
      {showSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <MailCheck className="h-4 w-4 text-green-500" />
          <AlertTitle>Invitation Sent!</AlertTitle>
          <AlertDescription>
            An invitation has been sent to {showSuccess}. They will receive an email with instructions to join as a co-parent.
          </AlertDescription>
        </Alert>
      )}
      
      {addingCoParent ? (
        <Card>
          <CardHeader>
            <CardTitle>Invite Co-Parent</CardTitle>
            <CardDescription>Send an invitation to your child's co-parent</CardDescription>
          </CardHeader>
          <CardContent>
            <CoParentInvite 
              onSubmit={handleInviteCoParent} 
              onCancel={() => setAddingCoParent(false)} 
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      ) : null}
      
      {invites.length === 0 && !addingCoParent ? (
        <Card className="p-6 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No co-parents invited yet</h3>
          <p className="text-gray-600 mt-2">
            Invite co-parents to collaborate on child-related matters
          </p>
          <Button 
            className="mt-4" 
            onClick={() => setAddingCoParent(true)}
          >
            Invite First Co-Parent
          </Button>
        </Card>
      ) : (
        <CoParentsList 
          currentUser={currentUser}
          invites={invites}
        />
      )}
    </div>
  );
};

export default CoParentsTab;
