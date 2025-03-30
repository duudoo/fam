
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyChildrenStateProps {
  onAddClick: () => void;
  disabled?: boolean;
}

const EmptyChildrenState = ({ onAddClick, disabled = false }: EmptyChildrenStateProps) => {
  return (
    <Card className="p-6 text-center">
      <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium">No children added yet</h3>
      <p className="text-gray-600 mt-2">
        Add a child to get started with co-parenting management
      </p>
      <Button 
        className="mt-4" 
        onClick={onAddClick}
        disabled={disabled}
      >
        Add First Child
      </Button>
    </Card>
  );
};

export default EmptyChildrenState;
