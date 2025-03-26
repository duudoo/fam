
import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChildForm from "@/components/user/ChildForm";
import { Child } from "@/utils/types";

interface ChildrenTabProps {
  children: Child[];
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
}

const ChildrenTab = ({ children, setChildren }: ChildrenTabProps) => {
  const [addingChild, setAddingChild] = useState(false);

  const handleAddChild = (child: Omit<Child, "id" | "parentIds">) => {
    const newChild: Child = {
      id: `child-${Date.now()}`,
      ...child,
      parentIds: ["current-user-id"]
    };
    
    setChildren([...children, newChild]);
    setAddingChild(false);
    toast.success(`Child ${child.initials} added successfully`);
  };

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
