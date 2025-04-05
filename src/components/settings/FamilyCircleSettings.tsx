
import { useEffect } from "react";
import { useFamilyCircle } from "@/hooks/useFamilyCircle";
import CircleTab from "./circle/CircleTab";

const FamilyCircleSettings = () => {
  const { fetchInvites } = useFamilyCircle();
  
  // Refresh invites when component mounts
  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);
  
  return <CircleTab />;
};

export default FamilyCircleSettings;
