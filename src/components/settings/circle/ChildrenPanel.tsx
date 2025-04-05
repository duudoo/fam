
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import ChildForm from "@/components/user/ChildForm";
import { useChildManagement } from "@/hooks/children/useChildManagement";
import { useChildren } from "@/hooks/children";
import ChildrenList from "@/components/user/children/ChildrenList";

const ChildrenPanel = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { data: children = [], isLoading } = useChildren();
  const { 
    submitting, 
    handleAddChild, 
  } = useChildManagement(children);
  
  if (isLoading) {
    return <div className="text-center py-4">Loading children...</div>;
  }
  
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
      
      {showAddForm ? (
        <div className="bg-gray-50 p-4 rounded-md border">
          <h4 className="text-md font-medium mb-4">Add a Child</h4>
          <ChildForm 
            onSubmit={handleAddChild}
            onCancel={() => setShowAddForm(false)}
            isSubmitting={submitting}
          />
        </div>
      ) : null}
      
      {children.length > 0 ? (
        <ChildrenList children={children} />
      ) : !showAddForm ? (
        <Alert>
          <AlertDescription>
            You haven't added any children yet. Click the button above to add your first child.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
};

export default ChildrenPanel;
