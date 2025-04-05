
import { useFamilyCircle } from "@/hooks/useFamilyCircle";
import { CircleTabs } from "./circle/CircleTabs";
import { CircleLoadingState } from "./circle/CircleLoadingState";
import { useEffect } from "react";
import { toast } from "sonner";

const FamilyCircleSettings = () => {
  const { currentUser, invites, setInvites, loading, fetchInvites } = useFamilyCircle();
  
  // Refresh invites when component mounts
  useEffect(() => {
    const loadInvites = async () => {
      try {
        await fetchInvites();
      } catch (error) {
        console.error("Error loading invites:", error);
        toast.error("Failed to load co-parent invites");
      }
    };
    
    loadInvites();
  }, [fetchInvites]);
  
  if (loading || !currentUser) {
    return <CircleLoadingState />;
  }

  return (
    <div className="space-y-6">
      <CircleTabs 
        currentUser={currentUser} 
        invites={invites} 
        setInvites={setInvites}
        onInviteSent={fetchInvites}
      />
    </div>
  );
};

export default FamilyCircleSettings;
