
import { useFamilyCircle } from "@/hooks/useFamilyCircle";
import { CircleTabs } from "./circle/CircleTabs";
import { CircleLoadingState } from "./circle/CircleLoadingState";

const FamilyCircleSettings = () => {
  const { currentUser, invites, setInvites, loading, fetchInvites } = useFamilyCircle();
  
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
