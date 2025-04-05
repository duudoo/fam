
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Child, AddChildInput } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export const useChildManagement = (
  children: Child[] = [],
  onChildAdded?: () => void
) => {
  const [addingChild, setAddingChild] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const checkAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error checking authentication:", error);
      setAuthError("Authentication error: " + error.message);
      return false;
    }
    
    if (!session) {
      setAuthError("You must be signed in to manage children");
      return false;
    }
    
    setAuthError(null);
    return true;
  };

  const handleAddChildClick = async () => {
    const isAuthenticated = await checkAuth();
    
    if (!isAuthenticated) {
      toast.error("You must be signed in to add children");
      navigate("/signin");
      return;
    }
    
    setAddingChild(true);
    setEditingChild(null);
  };

  const handleEditChild = (child: Child) => {
    setEditingChild(child);
    setAddingChild(false);
  };

  const handleAddChild = async (childData: AddChildInput) => {
    try {
      setSubmitting(true);
      
      // Verify authentication again
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        toast.error("Authentication failed. Please sign in again.");
        navigate("/signin");
        return;
      }
      
      if (!user) {
        toast.error("User information not available. Please sign in again.");
        navigate("/signin");
        return;
      }

      console.log("Adding child with user ID:", user.id);
      
      // Step 1: Create the child record
      const childInsertResult = await supabase
        .from('children')
        .insert({
          name: childData.name,
          date_of_birth: childData.dateOfBirth,
          initials: childData.initials
        })
        .select();

      if (childInsertResult.error) {
        console.error('Error creating child:', childInsertResult.error);
        
        // Log detailed information for debugging
        console.log('Child data attempted to insert:', {
          name: childData.name,
          date_of_birth: childData.dateOfBirth,
          initials: childData.initials
        });
        
        // Check for specific error cases
        if (childInsertResult.error.message.includes('permission denied') || 
            childInsertResult.error.message.includes('violates row-level security')) {
          toast.error("Permission denied. This is likely a database configuration issue.");
        } else {
          toast.error(`Failed to create child: ${childInsertResult.error.message}`);
        }
        return;
      }
      
      if (!childInsertResult.data || childInsertResult.data.length === 0) {
        console.error('No data returned after child insert');
        toast.error("Failed to create child record");
        return;
      }

      const newChild = childInsertResult.data[0];
      console.log("Child created:", newChild);

      // Step 2: Create the parent-child relationship
      const relationResult = await supabase
        .from('parent_children')
        .insert({
          parent_id: user.id,
          child_id: newChild.id,
          is_primary: true
        });

      if (relationResult.error) {
        console.error('Error creating parent-child relation:', relationResult.error);
        
        // Check for specific error cases
        if (relationResult.error.message.includes('permission denied')) {
          toast.error("Permission denied when linking child to parent. Please ensure you're signed in properly.");
          navigate("/signin");
        } else {
          toast.error(`Failed to link child to parent: ${relationResult.error.message}`);
        }
        
        // Try to clean up the orphaned child record
        try {
          await supabase.from('children').delete().eq('id', newChild.id);
        } catch (cleanupError) {
          console.error('Error cleaning up orphaned child record:', cleanupError);
        }
        
        return;
      }

      // Success! Close the form and show success message
      setAddingChild(false);
      toast.success(`Child ${childData.name || childData.initials} added successfully`);
      
      // Update the UI
      if (onChildAdded) {
        onChildAdded();
      } else {
        // Invalidate the children query to refetch the data
        queryClient.invalidateQueries({ queryKey: ['children'] });
      }
    } catch (error) {
      console.error('Error adding child:', error);
      toast.error("Failed to add child. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateChild = async (childId: string, childData: AddChildInput) => {
    try {
      setSubmitting(true);
      
      // Verify authentication
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated || !user) {
        toast.error("Authentication failed. Please sign in again.");
        navigate("/signin");
        return;
      }

      // First verify user has access to this child
      const { data: parentChildData, error: pcError } = await supabase
        .from('parent_children')
        .select('*')
        .eq('parent_id', user.id)
        .eq('child_id', childId)
        .single();
      
      if (pcError || !parentChildData) {
        toast.error("You don't have permission to update this child.");
        return;
      }
      
      // Update the child record
      const { error: updateError } = await supabase
        .from('children')
        .update({
          name: childData.name,
          date_of_birth: childData.dateOfBirth,
          initials: childData.initials
        })
        .eq('id', childId);

      if (updateError) {
        console.error('Error updating child:', updateError);
        toast.error(`Failed to update child: ${updateError.message}`);
        return;
      }

      // Success! Close the form and show success message
      setEditingChild(null);
      toast.success(`Child ${childData.name || childData.initials} updated successfully`);
      
      // Update the UI
      queryClient.invalidateQueries({ queryKey: ['children'] });
      if (onChildAdded) onChildAdded();
      
    } catch (error) {
      console.error('Error updating child:', error);
      toast.error("Failed to update child. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteChild = async (childId: string) => {
    try {
      setSubmitting(true);
      
      // Verify authentication
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated || !user) {
        toast.error("Authentication failed. Please sign in again.");
        navigate("/signin");
        return;
      }

      // Check if user has permission to delete this child
      const { data: parentChildData, error: pcError } = await supabase
        .from('parent_children')
        .select('*')
        .eq('parent_id', user.id)
        .eq('child_id', childId)
        .single();
      
      if (pcError || !parentChildData) {
        toast.error("You don't have permission to delete this child.");
        return;
      }
      
      // Delete the parent-child relationship first
      const { error: relationDeleteError } = await supabase
        .from('parent_children')
        .delete()
        .eq('parent_id', user.id)
        .eq('child_id', childId);
        
      if (relationDeleteError) {
        console.error('Error deleting parent-child relation:', relationDeleteError);
        toast.error(`Failed to delete child: ${relationDeleteError.message}`);
        return;
      }
      
      // Then delete the child record
      const { error: childDeleteError } = await supabase
        .from('children')
        .delete()
        .eq('id', childId);
        
      if (childDeleteError) {
        console.error('Error deleting child:', childDeleteError);
        toast.error(`Failed to delete child: ${childDeleteError.message}`);
        return;
      }

      toast.success("Child deleted successfully");
      
      // Update the UI
      queryClient.invalidateQueries({ queryKey: ['children'] });
      if (onChildAdded) onChildAdded();
      
    } catch (error) {
      console.error('Error deleting child:', error);
      toast.error("Failed to delete child. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    addingChild,
    editingChild,
    submitting,
    authError,
    checkAuth,
    handleAddChildClick,
    handleEditChild,
    handleAddChild,
    handleUpdateChild,
    handleDeleteChild,
    setAddingChild,
    setEditingChild
  };
};
