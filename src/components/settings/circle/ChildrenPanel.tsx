
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import ChildForm from "@/components/user/ChildForm";
import { useChildManagement } from "@/hooks/children/useChildManagement";
import { useChildren } from "@/hooks/children";
import ChildrenList from "@/components/user/children/ChildrenList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ChildrenPanel = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { data: children = [], isLoading } = useChildren();
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  
  const { 
    submitting,
    editingChild,
    handleAddChild,
    handleEditChild,
    handleUpdateChild,
    handleDeleteChild,
    setEditingChild
  } = useChildManagement(children);
  
  const confirmDelete = (childId: string) => {
    setShowDeleteDialog(childId);
  };

  const executeDelete = async () => {
    if (showDeleteDialog) {
      await handleDeleteChild(showDeleteDialog);
      setShowDeleteDialog(null);
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-4">Loading children...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Children</h3>
        <Button 
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm || !!editingChild}
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

      {editingChild ? (
        <div className="bg-gray-50 p-4 rounded-md border">
          <h4 className="text-md font-medium mb-4">Edit Child</h4>
          <ChildForm 
            onSubmit={(data) => handleUpdateChild(editingChild.id, data)}
            onCancel={() => setEditingChild(null)}
            isSubmitting={submitting}
            initialValues={{
              name: editingChild.name || '',
              initials: editingChild.initials,
              dateOfBirth: editingChild.dateOfBirth || ''
            }}
          />
        </div>
      ) : null}
      
      {children.length > 0 ? (
        <ChildrenList 
          children={children} 
          onEditChild={handleEditChild}
          onDeleteChild={confirmDelete}
        />
      ) : !showAddForm ? (
        <Alert>
          <AlertDescription>
            You haven't added any children yet. Click the button above to add your first child.
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteDialog} onOpenChange={(open) => !open && setShowDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this child? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={executeDelete} disabled={submitting}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChildrenPanel;
