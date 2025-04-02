
import { Spinner } from "@/components/ui/spinner";

export const CircleLoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-2">
      <Spinner size="md" />
      <div className="text-sm text-muted-foreground">Loading your family circle...</div>
    </div>
  );
};
