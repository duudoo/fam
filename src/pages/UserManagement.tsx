
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ChildrenTab from "@/components/user/ChildrenTab";
import CoParentsTab from "@/components/user/CoParentsTab";
import { useAuth } from "@/hooks/useAuth";
import { useFamilyCircle } from "@/hooks/useFamilyCircle";
import Navbar from "@/components/Navbar";

const UserManagementPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { currentUser, invites, setInvites, loading, fetchInvites } = useFamilyCircle();
  
  if (authLoading || loading) {
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
