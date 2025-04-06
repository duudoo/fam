
import { Expense, ExpenseStatus } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";
import CategoryBadge from "./CategoryBadge";
import ExpenseTableRow from "./ExpenseTableRow";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/utils/expenseUtils";

interface ExpenseListProps {
  expenses: Expense[] | undefined;
  filteredStatus?: string;
  onAddNewClick: () => void;
}

const ExpenseList = ({ expenses = [], filteredStatus, onAddNewClick }: ExpenseListProps) => {
  const { currency } = useCurrency();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Safely handle undefined expenses by providing a default empty array
  // Filter expenses by status if provided
  const filteredExpenses = expenses && filteredStatus && filteredStatus !== 'all'
    ? expenses.filter(expense => expense.status === filteredStatus)
    : expenses || [];

  if (filteredExpenses.length === 0) {
    return (
      <div className="col-span-3 text-center py-16">
        <p className="text-gray-500">
          {filteredStatus && filteredStatus !== 'all' 
            ? `No ${filteredStatus} expenses found.` 
            : "No matching expenses found."}
        </p>
        {!filteredStatus || filteredStatus === 'all' ? (
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onAddNewClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Expense
          </Button>
        ) : null}
      </div>
    );
  }

  const handleViewExpense = (id: string) => {
    navigate(`/expenses/${id}`);
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {filteredExpenses.map((expense) => (
          <div 
            key={expense.id} 
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium truncate pr-2">{expense.description}</div>
              <StatusBadge status={expense.status as ExpenseStatus} />
            </div>
            
            <div className="text-lg font-semibold mb-2">
              {formatCurrency(expense.amount, currency.symbol)}
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
              <div>{format(new Date(expense.date), 'MMM d, yyyy')}</div>
              <CategoryBadge category={expense.category} />
            </div>
            
            <div className="text-sm text-gray-500 mb-3">
              Split: {expense.splitMethod === 'custom' 
                ? `Custom (${expense.splitPercentage?.coParent}% / ${expense.splitPercentage?.[expense.paidBy]}%)` 
                : expense.splitMethod
              }
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handleViewExpense(expense.id)}
              >
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Split</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredExpenses.map((expense) => (
            <ExpenseTableRow key={expense.id} expense={expense} currency={currency} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseList;
