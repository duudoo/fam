
import { Child } from "@/utils/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface ChildrenListProps {
  children: Child[];
  onEditChild?: (child: Child) => void;
  onDeleteChild?: (childId: string) => void;
}

const ChildrenList = ({ children, onEditChild, onDeleteChild }: ChildrenListProps) => {
  return (
    <div className="space-y-4">
      {children.map((child) => (
        <Card key={child.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 bg-primary/10">
                <AvatarFallback className="text-primary font-semibold">
                  {child.initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h4 className="font-medium">{child.name || child.initials}</h4>
                {child.dateOfBirth && (
                  <p className="text-sm text-gray-500">
                    DOB: {format(new Date(child.dateOfBirth), "MMM d, yyyy")}
                  </p>
                )}
              </div>
              
              {(onEditChild || onDeleteChild) && (
                <div className="flex items-center gap-2">
                  {onEditChild && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEditChild(child)}
                      className="h-8 w-8 p-0"
                    >
                      <span className="sr-only">Edit</span>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onDeleteChild && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDeleteChild(child.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <span className="sr-only">Delete</span>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChildrenList;
