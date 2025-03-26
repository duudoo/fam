
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ChildrenTab from "@/components/user/ChildrenTab";
import CoParentsTab from "@/components/user/CoParentsTab";
import { Child, CoParentInvite, Parent } from "@/utils/types";

const UserManagementPage = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [invites, setInvites] = useState<CoParentInvite[]>([]);
  const [currentUser, setCurrentUser] = useState<Parent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchChildren();
    fetchInvites();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to access this page");
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile) {
        setCurrentUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone || undefined,
          avatar: profile.avatar_url,
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error("Failed to load user profile");
    }
  };

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select(`
          id,
          name,
          date_of_birth,
          initials,
          parent_children!inner (parent_id)
        `) as any;

      if (error) throw error;

      if (data) {
        setChildren(data.map((child: any) => ({
          id: child.id,
          name: child.name,
          dateOfBirth: child.date_of_birth,
          initials: child.initials,
          parentIds: [child.parent_children[0].parent_id]
        })));
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      toast.error("Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('co_parent_invites')
        .select('*')
        .eq('invited_by', user?.id) as any;

      if (error) throw error;

      if (data) {
        setInvites(data.map((invite: any) => ({
          id: invite.id,
          email: invite.email,
          status: invite.status,
          invitedBy: invite.invited_by,
          invitedAt: invite.invited_at,
          respondedAt: invite.responded_at
        })));
      }
    } catch (error) {
      console.error('Error fetching invites:', error);
      toast.error("Failed to load co-parent invites");
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto py-6 text-center">
        Please sign in to access this page
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-famacle-slate">User Management</h1>
      </div>

      <Tabs defaultValue="children" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="children">Children</TabsTrigger>
          <TabsTrigger value="coparents">Co-Parents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="children">
          <ChildrenTab 
            children={children}
            setChildren={setChildren}
            loading={loading}
            onChildAdded={fetchChildren}
          />
        </TabsContent>
        
        <TabsContent value="coparents">
          <CoParentsTab
            currentUser={currentUser}
            invites={invites}
            setInvites={setInvites}
            onInviteSent={fetchInvites}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementPage;
