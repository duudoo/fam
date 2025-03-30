
import { useState, useEffect } from "react";
import { Plus, Users, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import ChildForm from "@/components/user/ChildForm";
import { Child } from "@/utils/types";
import type { Database } from "@/integrations/supabase/database.types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type Tables = Database['public']['Tables'];
type ChildRow = Tables['children']['Row'];

interface ChildrenTabProps {
  children: Child[];
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
  loading?: boolean;
  onChildAdded?: () => void;
}

const ChildrenTab = ({ children, setChildren, loading = false, onChildAdded }: ChildrenTabProps) => {
  const [addingChild, setAddingChild] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check authentication status when component mounts or when user tries to add a child
  useEffect(() => {
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
    
    checkAuth();
  }, [user]);

  const handleAddChildClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("You must be signed in to add children");
      navigate("/signin");
      return;
    }
    
    setAddingChild(true);
  };

  const handleAddChild = async (child: Omit<Child, "id" | "parentIds">) => {
    try {
      setSubmitting(true);
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting user:', userError);
        toast.error("Authentication error. Please sign in again.");
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
        await supabase.from('children').delete().eq('id', newChild.id);
        return;
      }

      // Success! Close the form and show success message
      setAddingChild(false);
      toast.success(`Child ${child.name || child.initials} added successfully`);
      
      // Update the UI
      if (onChildAdded) {
        onChildAdded();
      } else {
        // If no callback provided, update the local state
        setChildren(prev => [...prev, {
          id: newChild.id,
          name: newChild.name || undefined,
          dateOfBirth: newChild.date_of_birth || undefined,
          initials: newChild.initials,
          parentIds: [user.id]
        }]);
      }
    } catch (error) {
      console.error('Error adding child:', error);
      toast.error("Failed to add child. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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
          disabled={addingChild || submitting}
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
      
      {children.length === 0 && !addingChild ? (
        <Card className="p-6 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No children added yet</h3>
          <p className="text-gray-600 mt-2">
            Add a child to get started with co-parenting management
          </p>
          <Button 
            className="mt-4" 
            onClick={handleAddChildClick}
            disabled={addingChild || submitting}
          >
            Add First Child
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {children.map(child => (
            <Card key={child.id}>
              <CardHeader>
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
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChildrenTab;
