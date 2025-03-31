
import { Card, CardContent } from "@/components/ui/card";

const ExpenseNotFound = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Expense Not Found</h2>
          <p className="text-gray-600">The expense you're looking for doesn't exist or has been removed.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseNotFound;
