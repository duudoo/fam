
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Parent, CoParentInvite } from "@/utils/types";
import ChildrenTab from "@/components/user/ChildrenTab";
import CoParentsTab from "@/components/user/CoParentsTab";

const FamilyCircleSettings = () => {
  const { user, profile } = useAuth();
  const [invites, setInvites] = useState<CoParentInvite[]>([]);
  
  if (!user || !profile) {
    return <div>Loading your family circle...</div>;
  }

  const currentUser: Parent = {
    id: user.id,
    fullName: profile.full_name || 'User',
    email: user.email || '',
    avatarUrl: profile.avatar_url,
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="children" className="space-y-4">
        <TabsList>
          <TabsTrigger value="children">Children</TabsTrigger>
          <TabsTrigger value="coparents">Co-Parents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="children">
          <ChildrenTab />
        </TabsContent>
        
        <TabsContent value="coparents">
          <CoParentsTab 
            currentUser={currentUser} 
            invites={invites} 
            setInvites={setInvites} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FamilyCircleSettings;
