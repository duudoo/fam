
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFamilyCircle } from "@/hooks/useFamilyCircle";
import CoParentsPanel from "./CoParentsPanel";
import ChildrenPanel from "./ChildrenPanel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { CircleLoadingState } from "./CircleLoadingState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const CircleTab = () => {
  const { 
    currentUser, 
    invites, 
    receivedInvites,
    loading, 
    error,
    fetchInvites
  } = useFamilyCircle();
  
  const { profile, profileError, refreshProfile } = useAuth();

  if (loading) {
    return <CircleLoadingState />;
  }
  
  if (profileError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{profileError}</p>
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={refreshProfile}
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!currentUser && profile) {
    // We have a profile but no current user in family circle
    // Create a fallback user object
    const fallbackUser = {
      id: profile.id,
      name: profile.full_name || profile.first_name || profile.email.split('@')[0] || 'User',
      email: profile.email || '',
      avatar: profile.avatar_url,
      phone: profile.phone
    };
    
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
                currentUser={fallbackUser}
                sentInvites={invites}
                receivedInvites={receivedInvites}
                onInviteSent={fetchInvites}
                error={error}
              />
            </TabsContent>
            
            <TabsContent value="children">
              <ChildrenPanel />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
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
