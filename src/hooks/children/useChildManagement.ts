
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Child } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export const useChildManagement = (
  children: Child[] = [],
  onChildAdded?: () => void
) => {
  const [addingChild, setAddingChild] = useState(false);
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
      setAuthError("You must be signed in to add children");
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
  };

  const handleAddChild = async (child: Omit<Child, "id" | "parentIds">) => {
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
          name: child.name,
          date_of_birth: child.dateOfBirth,
          initials: child.initials
        })
        .select();

      if (childInsertResult.error) {
        console.error('Error creating child:', childInsertResult.error);
        
        // Check for specific error cases
        if (childInsertResult.error.message.includes('permission denied')) {
          toast.error("Permission denied. Please ensure you're signed in properly.");
          navigate("/signin");
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
      toast.success(`Child ${child.name || child.initials} added successfully`);
      
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

  return {
    addingChild,
    submitting,
    authError,
    checkAuth,
    handleAddChildClick,
    handleAddChild,
    setAddingChild
  };
};
