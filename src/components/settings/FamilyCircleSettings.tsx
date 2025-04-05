
import { useFamilyCircle } from "@/hooks/useFamilyCircle";
import { CircleTabs } from "./circle/CircleTabs";
import { CircleLoadingState } from "./circle/CircleLoadingState";
import { useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const FamilyCircleSettings = () => {
  const { 
    currentUser, 
    invites, 
    receivedInvites,
    setInvites, 
    setReceivedInvites,
    loading, 
    error, 
    fetchInvites 
  } = useFamilyCircle();
  
  // Refresh invites when component mounts
  useEffect(() => {
    const loadInvites = async () => {
      try {
        await fetchInvites();
      } catch (error) {
        console.error("Error loading invites:", error);
        // Toast is already shown in the fetchInvites function
      }
    };
    
    loadInvites();
  }, [fetchInvites]);
  
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
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    
      <CircleTabs 
        currentUser={currentUser} 
        invites={invites}
        receivedInvites={receivedInvites}
        setInvites={setInvites}
        setReceivedInvites={setReceivedInvites}
        onInviteSent={fetchInvites}
      />
    </div>
  );
};

export default FamilyCircleSettings;
