
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

interface ExpenseListProps {
  expenses: Expense[] | undefined;
  filteredStatus?: string;
  onAddNewClick: () => void;
}

const ExpenseList = ({ expenses = [], filteredStatus, onAddNewClick }: ExpenseListProps) => {
  const { currency } = useCurrency();
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
