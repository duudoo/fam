
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoParentsTab from "@/components/user/CoParentsTab";
import ChildrenTab from "@/components/user/ChildrenTab";
import { CoParentInvite, Parent } from "@/utils/types";

interface CircleTabsProps {
  currentUser: Parent;
  invites: CoParentInvite[];
  receivedInvites: CoParentInvite[];
  setInvites: React.Dispatch<React.SetStateAction<CoParentInvite[]>>;
  setReceivedInvites?: React.Dispatch<React.SetStateAction<CoParentInvite[]>>;
  onInviteSent?: () => void;
}

export const CircleTabs = ({
  currentUser,
  invites,
  receivedInvites,
  setInvites,
  setReceivedInvites,
  onInviteSent,
}: CircleTabsProps) => {
  return (
    <Tabs defaultValue="coparents">
      <TabsList>
        <TabsTrigger value="coparents">Co-Parents</TabsTrigger>
        <TabsTrigger value="children">Children</TabsTrigger>
      </TabsList>
      
      <TabsContent value="coparents">
        <CoParentsTab
          currentUser={currentUser}
          invites={invites}
          receivedInvites={receivedInvites}
          setInvites={setInvites}
          setReceivedInvites={setReceivedInvites}
          onInviteSent={onInviteSent}
        />
      </TabsContent>
      
      <TabsContent value="children">
        <ChildrenTab />
      </TabsContent>
    </Tabs>
  );
};
