
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface FormActionsProps {
  onCancel: () => void;
  isPending: boolean;
  isEditing: boolean;
}

const FormActions = ({ onCancel, isPending, isEditing }: FormActionsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 justify-end mt-8 mb-4`}>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className={`${isMobile ? 'order-2 py-2.5' : ''} w-full md:w-auto`}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isPending}
        className={`bg-famacle-blue hover:bg-famacle-blue/90 ${isMobile ? 'order-1 py-2.5' : ''} w-full md:w-auto`}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? 'Update Event' : 'Create Event'}
      </Button>
    </div>
  );
};

export default FormActions;
