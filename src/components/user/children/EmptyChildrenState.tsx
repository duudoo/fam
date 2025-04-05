
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface EmptyChildrenStateProps {
  onAddClick: () => void;
  disabled?: boolean;
}

const EmptyChildrenState = ({ onAddClick, disabled }: EmptyChildrenStateProps) => {
  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle>No Children Added Yet</CardTitle>
        <CardDescription>
          Add children to manage their expenses and track activities
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-6">
        <Button 
          onClick={onAddClick} 
          disabled={disabled}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Child
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyChildrenState;
