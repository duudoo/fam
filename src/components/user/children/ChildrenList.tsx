
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Child } from "@/utils/types";

interface ChildrenListProps {
  children: Child[];
}

const ChildrenList = ({ children }: ChildrenListProps) => {
  if (children.length === 0) return null;
  
  return (
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
  );
};

export default ChildrenList;
