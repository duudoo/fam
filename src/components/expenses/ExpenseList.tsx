
import { Expense } from "@/utils/types";
import ExpenseCard from "@/components/ExpenseCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ExpenseListProps {
  expenses: Expense[];
  filteredStatus?: string;
  onAddNewClick: () => void;
}

const ExpenseList = ({ expenses, filteredStatus, onAddNewClick }: ExpenseListProps) => {
  // Filter expenses by status if provided
  const filteredExpenses = filteredStatus && filteredStatus !== 'all'
    ? expenses.filter(expense => expense.status === filteredStatus)
    : expenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredExpenses.length > 0 ? (
        filteredExpenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))
      ) : (
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
      )}
    </div>
  );
};

export default ExpenseList;
