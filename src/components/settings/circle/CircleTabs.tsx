
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ChildrenTab from "@/components/user/ChildrenTab";
import CoParentsTab from "@/components/user/CoParentsTab";
import { Parent, CoParentInvite } from "@/utils/types";

interface CircleTabsProps {
  currentUser: Parent;
  invites: CoParentInvite[];
  setInvites: React.Dispatch<React.SetStateAction<CoParentInvite[]>>;
  onInviteSent?: () => void;
}

export const CircleTabs = ({ 
  currentUser, 
  invites, 
  setInvites,
  onInviteSent 
}: CircleTabsProps) => {
  return (
    <Tabs defaultValue="children" className="space-y-4">
      <TabsList>
        <TabsTrigger value="children">Children</TabsTrigger>
        <TabsTrigger value="coparents">Co-Parents</TabsTrigger>
      </TabsList>
      
      <TabsContent value="children">
        <ChildrenTab onChildAdded={onInviteSent} />
      </TabsContent>
      
      <TabsContent value="coparents">
        <CoParentsTab 
          currentUser={currentUser} 
          invites={invites} 
          setInvites={setInvites}
          onInviteSent={onInviteSent}
        />
      </TabsContent>
    </Tabs>
  );
};
