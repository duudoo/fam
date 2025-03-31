
import { Card, CardContent } from "@/components/ui/card";

interface ExpenseDetailErrorProps {
  error: string;
}

const ExpenseDetailError = ({ error }: ExpenseDetailErrorProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseDetailError;
