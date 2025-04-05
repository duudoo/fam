
import { Child } from "@/utils/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface ChildrenListProps {
  children: Child[];
}

const ChildrenList = ({ children }: ChildrenListProps) => {
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChildrenList;
