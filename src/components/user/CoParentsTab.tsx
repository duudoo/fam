
import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import CoParentInvite from "@/components/user/CoParentInvite";
import CoParentsList from "@/components/user/CoParentsList";
import { CoParentInvite as CoParentInviteType, Parent } from "@/utils/types";

interface CoParentsTabProps {
  currentUser: Parent;
  invites: CoParentInviteType[];
  setInvites: React.Dispatch<React.SetStateAction<CoParentInviteType[]>>;
  onInviteSent?: () => void;
}

const CoParentsTab = ({ currentUser, invites, setInvites, onInviteSent }: CoParentsTabProps) => {
  const [addingCoParent, setAddingCoParent] = useState(false);

  const handleInviteCoParent = async (email: string, message?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to send invites");
        return;
      }

      const { error } = await supabase
        .from('co_parent_invites')
        .insert([{
          email,
          invited_by: user.id,
          status: 'pending'
        }]);

      if (error) throw error;

      setAddingCoParent(false);
      toast.success(`Invitation sent to ${email}`);
      onInviteSent?.();
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error("Failed to send invitation");
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
