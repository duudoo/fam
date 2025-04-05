
import { useState, useEffect } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import ChildForm from "@/components/user/ChildForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useChildManagement } from "@/hooks/children/useChildManagement";
import EmptyChildrenState from "@/components/user/children/EmptyChildrenState";
import ChildrenList from "@/components/user/children/ChildrenList";
import { useChildren } from "@/hooks/children";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ChildrenTabProps {
  onChildAdded?: () => void;
}

const ChildrenTab = ({ onChildAdded }: ChildrenTabProps) => {
  const { user } = useAuth();
  const { data: children = [], isLoading } = useChildren();
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  
  const { 
    addingChild, 
    editingChild,
    submitting, 
    authError, 
    handleAddChildClick, 
    handleEditChild,
    handleAddChild,
    handleUpdateChild,
    handleDeleteChild,
    setAddingChild,
    setEditingChild
  } = useChildManagement(children, onChildAdded);

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    };
    
    checkAuth();
  }, [user]);

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
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="grid gap-4">
      {authError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-famacle-slate">Children</h2>
        <Button 
          onClick={handleAddChildClick} 
          disabled={addingChild || editingChild !== null || submitting}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Child
        </Button>
      </div>
      
      {addingChild ? (
        <Card>
          <CardHeader>
            <CardTitle>Add Child</CardTitle>
            <CardDescription>Add a child's details to your family</CardDescription>
          </CardHeader>
          <CardContent>
            <ChildForm 
              onSubmit={handleAddChild} 
              onCancel={() => setAddingChild(false)} 
              isSubmitting={submitting}
            />
          </CardContent>
        </Card>
      ) : null}

      {editingChild ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Child</CardTitle>
            <CardDescription>Update child's details</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      ) : null}
      
      {children.length === 0 && !addingChild ? (
        <EmptyChildrenState 
          onAddClick={handleAddChildClick} 
          disabled={addingChild || editingChild !== null || submitting} 
        />
      ) : (
        <ChildrenList 
          children={children} 
          onEditChild={handleEditChild}
          onDeleteChild={confirmDelete}
        />
      )}

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

export default ChildrenTab;
