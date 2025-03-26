
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChildrenTab from "@/components/user/ChildrenTab";
import CoParentsTab from "@/components/user/CoParentsTab";
import { Child, CoParentInvite, Parent } from "@/utils/types";

const UserManagementPage = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [invites, setInvites] = useState<CoParentInvite[]>([]);
  const [currentUser, setCurrentUser] = useState<Parent>({
    id: "current-user-id",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567"
  });

  // Mock data initialization for demonstration
  useEffect(() => {
    // In a real app, this would fetch from an API or database
    const mockChildren: Child[] = [
      {
        id: "1",
        initials: "JD",
        name: "Jane Doe",
        dateOfBirth: "2018-05-12",
        parentIds: ["current-user-id"]
      }
    ];

    const mockInvites: CoParentInvite[] = [
      {
        id: "1",
        email: "coparent@example.com",
        status: "pending",
        invitedBy: "current-user-id",
        invitedAt: new Date().toISOString(),
      }
    ];

    setChildren(mockChildren);
    setInvites(mockInvites);
  }, []);

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
          />
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

export default UserManagementPage;
