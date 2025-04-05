
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

const ChildrenPanel = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Children</h3>
        <Button 
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Child
        </Button>
      </div>
      
      <Alert>
        <AlertDescription>
          The children management functionality will be implemented soon.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ChildrenPanel;
