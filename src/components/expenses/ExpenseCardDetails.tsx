
import { formatDate, getStatusColor, getStatusText } from "@/utils/expenseUtils";
import { Expense } from "@/utils/types";
import { Calendar } from "lucide-react";

interface ExpenseCardDetailsProps {
  expense: Expense;
}

const ExpenseCardDetails = ({ expense }: ExpenseCardDetailsProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>{formatDate(expense.date)}</span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
          {getStatusText(expense.status)}
        </div>
      </div>
      
      {expense.notes && (
        <div className="text-sm text-gray-600 border-t pt-2 mt-2">
          <p className="line-clamp-2">{expense.notes}</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseCardDetails;
