
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, FileText, Users } from "lucide-react";
import { Expense } from "@/utils/types";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/expenses/StatusBadge";
import CategoryBadge from "@/components/expenses/CategoryBadge";

interface ExpenseCardProps {
  expense: Expense;
  currency?: string;
}

const ExpenseCard = ({ expense, currency = "$" }: ExpenseCardProps) => {
  const formattedDate = format(new Date(expense.date), "MMM d, yyyy");
  
  return (
    <Link to={`/expense/${expense.id}`} className="block">
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-base text-famacle-slate line-clamp-1">{expense.description}</h3>
            <StatusBadge status={expense.status} />
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-famacle-slate">{currency}{expense.amount.toFixed(2)}</span>
            <CategoryBadge category={expense.category} />
          </div>
          
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-3">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
          
          {expense.notes && (
            <div className="mt-2 text-xs text-gray-600 line-clamp-1">
              <FileText className="w-3 h-3 inline mr-1" />
              {expense.notes}
            </div>
          )}
          
          {expense.childIds && expense.childIds.length > 0 && (
            <div className="mt-2 text-xs text-gray-600">
              <Users className="w-3 h-3 inline mr-1" />
              {expense.childIds.length} {expense.childIds.length === 1 ? 'child' : 'children'}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ExpenseCard;
