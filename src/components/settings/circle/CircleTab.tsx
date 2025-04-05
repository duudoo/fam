
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFamilyCircle } from "@/hooks/useFamilyCircle";
import CoParentsPanel from "./CoParentsPanel";
import ChildrenPanel from "./ChildrenPanel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { CircleLoadingState } from "./CircleLoadingState";

const CircleTab = () => {
  const { 
    currentUser, 
    invites, 
    receivedInvites,
    loading, 
    error,
    receiveError,
    fetchInvites
  } = useFamilyCircle();

  if (loading) {
    return <CircleLoadingState />;
  }
  
  if (!currentUser) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          Unable to load your user profile. Please try signing out and back in.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Family Circle</CardTitle>
        <CardDescription>
          Manage your co-parents and children
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="coparents">
          <TabsList className="mb-4">
            <TabsTrigger value="coparents">Co-Parents</TabsTrigger>
            <TabsTrigger value="children">Children</TabsTrigger>
          </TabsList>
          
          <TabsContent value="coparents">
            <CoParentsPanel
              currentUser={currentUser}
              sentInvites={invites}
              receivedInvites={receivedInvites}
              onInviteSent={fetchInvites}
              error={error}
              receiveError={receiveError}
            />
          </TabsContent>
          
          <TabsContent value="children">
            <ChildrenPanel />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CircleTab;
