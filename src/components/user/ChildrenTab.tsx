
import { useState, useEffect } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import ChildForm from "@/components/user/ChildForm";
import { Child } from "@/utils/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useChildManagement } from "@/hooks/children/useChildManagement";
import EmptyChildrenState from "@/components/user/children/EmptyChildrenState";
import ChildrenList from "@/components/user/children/ChildrenList";
import { useChildren } from "@/hooks/children";

interface ChildrenTabProps {
  onChildAdded?: () => void;
}

const ChildrenTab = ({ onChildAdded }: ChildrenTabProps) => {
  const { user } = useAuth();
  const { data: children = [], isLoading } = useChildren();
  const { 
    addingChild, 
    submitting, 
    authError, 
    handleAddChildClick, 
    handleAddChild, 
    setAddingChild 
  } = useChildManagement(children, onChildAdded);

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    };
    
    checkAuth();
  }, [user]);

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
        <EmptyChildrenState 
          onAddClick={handleAddChildClick} 
          disabled={addingChild || submitting} 
        />
      ) : (
        <ChildrenList children={children} />
      )}
    </div>
  );
};

export default ChildrenTab;
