
import { Expense } from "@/utils/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";
import CategoryBadge from "./CategoryBadge";
import { useState } from "react";
import ExpenseStatusMenu from "./ExpenseStatusMenu";
import { Button } from "@/components/ui/button";
import { Edit2, Eye } from "lucide-react";
import { formatCurrency } from "@/utils/expenseUtils";
import { Currency } from "@/contexts/CurrencyContext";
import ExpenseForm from "./form/ExpenseForm";
import ExpenseDetailDialog from "./ExpenseDetailDialog";

interface ExpenseTableRowProps {
  expense: Expense;
  currency: Currency;
}

const ExpenseTableRow = ({ expense, currency }: ExpenseTableRowProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
  };

  const canEdit = expense.status !== 'paid';

  if (isEditing) {
    return (
      <TableRow>
        <TableCell colSpan={7}>
          <ExpenseForm 
            expense={expense}
            onExpenseAdded={() => setIsEditing(false)} 
            onCancel={() => setIsEditing(false)}
          />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      <TableRow className={
        (isDeleting || isUpdating) ? "opacity-60 pointer-events-none" : ""
      }>
        <TableCell className="font-medium">{expense.description}</TableCell>
        <TableCell>{formatCurrency(expense.amount, currency.symbol)}</TableCell>
        <TableCell>{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
        <TableCell><CategoryBadge category={expense.category} /></TableCell>
        <TableCell><StatusBadge status={expense.status} /></TableCell>
        <TableCell>{expense.splitMethod}</TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setShowDetails(true)}>
              <Eye className="h-4 w-4" />
            </Button>
            {canEdit && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <ExpenseStatusMenu 
              expenseId={expense.id}
              currentStatus={expense.status}
              isProcessing={isDeleting || isUpdating}
              onStatusChange={() => setIsUpdating(true)}
              onDelete={handleDelete}
            />
          </div>
        </TableCell>
      </TableRow>
      
      <ExpenseDetailDialog 
        expense={expense} 
        open={showDetails} 
        onOpenChange={setShowDetails} 
        onEdit={() => {
          setShowDetails(false);
          setIsEditing(true);
        }}
      />
    </>
  );
};

export default ExpenseTableRow;
