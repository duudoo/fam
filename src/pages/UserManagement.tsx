
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ChildrenTab from "@/components/user/ChildrenTab";
import CoParentsTab from "@/components/user/CoParentsTab";
import { Child, CoParentInvite, Parent } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/database.types";

type Tables = Database['public']['Tables'];
type ProfileRow = Tables['profiles']['Row'];
type ChildRow = Tables['children']['Row'];
type CoParentInviteRow = Tables['co_parent_invites']['Row'];

const UserManagementPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [invites, setInvites] = useState<CoParentInvite[]>([]);
  const [currentUser, setCurrentUser] = useState<Parent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Convert profile data to Parent type when profile changes
    if (profile) {
      setCurrentUser({
        id: profile.id,
        name: profile.full_name || profile.first_name || '',
        email: profile.email,
        phone: profile.phone || undefined,
        avatar: profile.avatar_url,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchChildren();
      fetchInvites();
    }
  }, [user]);

  const fetchChildren = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('children')
        .select(`
          id,
          name,
          date_of_birth,
          initials,
          parent_children!inner (parent_id)
        `)
        .eq('parent_children.parent_id', user.id);

      if (error) throw error;

      if (data) {
        setChildren(data.map((child) => ({
          id: child.id,
          name: child.name || undefined,
          dateOfBirth: child.date_of_birth || undefined,
          initials: child.initials,
          parentIds: child.parent_children ? [child.parent_children[0].parent_id] : []
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
      if (!user) return;

      const { data, error } = await supabase
        .from('co_parent_invites')
        .select('*')
        .eq('invited_by', user.id);

      if (error) throw error;

      if (data) {
        setInvites(data.map((invite) => ({
          id: invite.id,
          email: invite.email,
          status: invite.status as any,
          invitedBy: invite.invited_by,
          invitedAt: invite.invited_at,
          message: invite.message || undefined,
          respondedAt: invite.responded_at || undefined
        })));
      }
    } catch (error) {
      console.error('Error fetching invites:', error);
      toast.error("Failed to load co-parent invites");
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto py-6 text-center">
        Loading...
      </div>
    );
  }

  if (!user || !currentUser) {
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
