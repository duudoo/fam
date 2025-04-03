
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Child } from "@/utils/types";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import ChildForm from "@/components/user/ChildForm";

interface ChildrenListProps {
  children: Child[];
}

const ChildrenList = ({ children }: ChildrenListProps) => {
  const [childToEdit, setChildToEdit] = useState<Child | null>(null);
  const [childToDelete, setChildToDelete] = useState<Child | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  if (children.length === 0) return null;
  
  const handleEditClick = (child: Child) => {
    setChildToEdit(child);
  };
  
  const handleDeleteClick = (child: Child) => {
    setChildToDelete(child);
  };
  
  const handleUpdateChild = async (updatedData: Omit<Child, "id" | "parentIds">) => {
    if (!childToEdit) return;
    
    try {
      setIsSubmitting(true);
      
      // Update the child record
      const { error } = await supabase
        .from('children')
        .update({
          name: updatedData.name || null,
          date_of_birth: updatedData.dateOfBirth || null,
          initials: updatedData.initials
        })
        .eq('id', childToEdit.id);
        
      if (error) {
        console.error('Error updating child:', error);
        toast.error(`Failed to update child: ${error.message}`);
        return;
      }
      
      // Success
      toast.success(`Child updated successfully`);
      setChildToEdit(null);
      
      // Invalidate the children query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['children'] });
    } catch (error) {
      console.error('Error updating child:', error);
      toast.error("Failed to update child. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteChild = async () => {
    if (!childToDelete) return;
    
    try {
      setIsSubmitting(true);
      
      // First, delete the parent-child relationship
      const { error: relationError } = await supabase
        .from('parent_children')
        .delete()
        .eq('child_id', childToDelete.id);
        
      if (relationError) {
        console.error('Error deleting parent-child relation:', relationError);
        toast.error(`Failed to delete child: ${relationError.message}`);
        return;
      }
      
      // Then, delete the child record
      const { error: childError } = await supabase
        .from('children')
        .delete()
        .eq('id', childToDelete.id);
        
      if (childError) {
        console.error('Error deleting child:', childError);
        toast.error(`Failed to delete child: ${childError.message}`);
        return;
      }
      
      // Success
      toast.success(`Child deleted successfully`);
      setChildToDelete(null);
      
      // Invalidate the children query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['children'] });
    } catch (error) {
      console.error('Error deleting child:', error);
      toast.error("Failed to delete child. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        {children.map(child => (
          <Card key={child.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-famacle-blue flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{child.initials}</span>
                  </div>
                  <div>
                    <CardTitle>{child.name || child.initials}</CardTitle>
                    {child.dateOfBirth && (
                      <CardDescription>
                        Born: {new Date(child.dateOfBirth).toLocaleDateString()}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditClick(child)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteClick(child)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      
      {/* Edit Child Dialog */}
      <Dialog open={!!childToEdit} onOpenChange={(open) => !open && setChildToEdit(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <CardTitle className="mb-4">Edit Child</CardTitle>
          {childToEdit && (
            <ChildForm 
              onSubmit={handleUpdateChild}
              onCancel={() => setChildToEdit(null)}
              isSubmitting={isSubmitting}
              initialData={{
                initials: childToEdit.initials,
                name: childToEdit.name,
                dateOfBirth: childToEdit.dateOfBirth
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!childToDelete} onOpenChange={(open) => !open && setChildToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {childToDelete?.name || childToDelete?.initials}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteChild}
              disabled={isSubmitting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChildrenList;
