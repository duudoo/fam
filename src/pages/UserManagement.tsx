
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ChildrenTab from "@/components/user/ChildrenTab";
import CoParentsTab from "@/components/user/CoParentsTab";
import { CoParentInvite, Parent } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/database.types";
import Navbar from "@/components/Navbar";

type Tables = Database['public']['Tables'];
type ProfileRow = Tables['profiles']['Row'];
type CoParentInviteRow = Tables['co_parent_invites']['Row'];

const UserManagementPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
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
      fetchInvites();
    }
  }, [user]);

  const fetchInvites = useCallback(async () => {
    try {
      if (!user) return;

      console.log("Fetching invites for user ID:", user.id);
      setLoading(true);
      
      const { data, error } = await supabase
        .from('co_parent_invites')
        .select('*')
        .eq('invited_by', user.id);

      if (error) {
        console.error('Error in fetchInvites query:', error);
        toast.error("Failed to load co-parent invites");
        return;
      }

      console.log("Fetched invites:", data);
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
    } finally {
      setLoading(false);
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto py-6 pt-24 max-w-5xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!user || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto py-6 pt-24 max-w-5xl">
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-xl font-semibold text-famacle-slate mb-2">Please Sign In</h2>
            <p className="text-gray-500">You need to be signed in to manage your family circle.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-6 pt-24 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-famacle-slate">Circle</h1>
        </div>

        <Tabs defaultValue="children" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="children">Children</TabsTrigger>
            <TabsTrigger value="coparents">Co-Parents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="children">
            <ChildrenTab 
              onChildAdded={fetchInvites}
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
      </main>
    </div>
  );
};

export default UserManagementPage;
