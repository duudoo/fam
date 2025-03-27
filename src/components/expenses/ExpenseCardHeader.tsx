
import { formatCurrency, getCategoryColor, getCategoryIcon } from "@/utils/expenseUtils";
import { Expense } from "@/utils/types";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

interface ExpenseCardHeaderProps {
  expense: Expense;
}

const ExpenseCardHeader = ({ expense }: ExpenseCardHeaderProps) => {
  const iconName = getCategoryIcon(expense.category);
  // @ts-ignore - Dynamic icon import
  const Icon: LucideIcon = Icons[iconName.charAt(0).toUpperCase() + iconName.slice(1)] || Icons.Circle;

  return (
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${getCategoryColor(expense.category)} text-white mr-3`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-medium text-famacle-slate">{expense.description}</h3>
          <p className="text-sm text-gray-500">{expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-famacle-slate">{formatCurrency(expense.amount)}</p>
        <p className="text-sm text-gray-500">{expense.splitMethod}</p>
      </div>
    </div>
  );
};

export default ExpenseCardHeader;
