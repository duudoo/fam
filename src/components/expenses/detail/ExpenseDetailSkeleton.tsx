
import { Card, CardContent } from "@/components/ui/card";

const ExpenseDetailSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseDetailSkeleton;
