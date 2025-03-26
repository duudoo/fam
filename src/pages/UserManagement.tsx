
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChildForm from "@/components/user/ChildForm";
import CoParentInvite from "@/components/user/CoParentInvite";
import { Child, CoParentInvite as CoParentInviteType } from "@/utils/types";

const UserManagementPage = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [invites, setInvites] = useState<CoParentInviteType[]>([]);
  const [addingChild, setAddingChild] = useState(false);
  const [addingCoParent, setAddingCoParent] = useState(false);

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

    const mockInvites: CoParentInviteType[] = [
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

  const handleAddChild = (child: Omit<Child, "id" | "parentIds">) => {
    const newChild: Child = {
      id: `child-${Date.now()}`,
      ...child,
      parentIds: ["current-user-id"]
    };
    
    setChildren([...children, newChild]);
    setAddingChild(false);
    toast.success(`Child ${child.initials} added successfully`);
  };

  const handleInviteCoParent = (email: string) => {
    const newInvite: CoParentInviteType = {
      id: `invite-${Date.now()}`,
      email,
      status: "pending",
      invitedBy: "current-user-id",
      invitedAt: new Date().toISOString(),
    };
    
    setInvites([...invites, newInvite]);
    setAddingCoParent(false);
    toast.success(`Invitation sent to ${email}`);
  };

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
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-famacle-slate">Children</h2>
              <Button onClick={() => setAddingChild(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Child
              </Button>
            </div>
            
            {addingChild ? (
              <Card>
                <CardHeader>
                  <CardTitle>Add Child</CardTitle>
                  <CardDescription>Add a child's details to your family</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChildForm 
                    onSubmit={handleAddChild} 
                    onCancel={() => setAddingChild(false)} 
                  />
                </CardContent>
              </Card>
            ) : null}
            
            {children.length === 0 && !addingChild ? (
              <Card className="p-6 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No children added yet</h3>
                <p className="text-gray-600 mt-2">
                  Add a child to get started with co-parenting management
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => setAddingChild(true)}
                >
                  Add First Child
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {children.map(child => (
                  <Card key={child.id}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-famacle-blue flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{child.initials}</span>
                        </div>
                        <div>
                          <CardTitle>{child.name || child.initials}</CardTitle>
                          {child.dateOfBirth && (
                            <CardDescription>
                              Born: {new Date(child.dateOfBirth).toLocaleDateString()}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="coparents">
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
              <div className="grid md:grid-cols-2 gap-4">
                {invites.map(invite => (
                  <Card key={invite.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{invite.email}</CardTitle>
                          <CardDescription>
                            Status: <span className="capitalize">{invite.status}</span>
                          </CardDescription>
                          <CardDescription>
                            Invited: {new Date(invite.invitedAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center justify-center h-10 px-4 rounded-full bg-yellow-100 text-yellow-800">
                          {invite.status === "pending" ? "Pending" : 
                            invite.status === "accepted" ? "Accepted" : "Declined"}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementPage;
