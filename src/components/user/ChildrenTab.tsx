
import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import ChildForm from "@/components/user/ChildForm";
import { Child } from "@/utils/types";
import type { Database } from "@/integrations/supabase/database.types";

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

  const handleAddChild = async (child: Omit<Child, "id" | "parentIds">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to add a child");
        return;
      }

      const { data: newChild, error: childError } = await supabase
        .from('children')
        .insert({
          name: child.name,
          date_of_birth: child.dateOfBirth,
          initials: child.initials
        })
        .select()
        .single();

      if (childError) throw childError;
      if (!newChild) throw new Error("Failed to create child");

      const { error: relationError } = await supabase
        .from('parent_children')
        .insert({
          parent_id: user.id,
          child_id: newChild.id,
          is_primary: true
        });

      if (relationError) throw relationError;

      setAddingChild(false);
      toast.success(`Child ${child.name || child.initials} added successfully`);
      onChildAdded?.();
    } catch (error) {
      console.error('Error adding child:', error);
      toast.error("Failed to add child");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-famacle-slate">Children</h2>
        <Button onClick={() => setAddingChild(true)}>
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
            onClick={() => setAddingChild(true)}
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
