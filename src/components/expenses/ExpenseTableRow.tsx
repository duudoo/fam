import { Expense } from "@/utils/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";
import CategoryBadge from "./CategoryBadge";
import { useState } from "react";
import ExpenseStatusMenu from "./ExpenseStatusMenu";
import { Button } from "@/components/ui/button";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/expenseUtils";
import { Currency } from "@/contexts/CurrencyContext";
import ExpenseForm from "./form/ExpenseForm";
import ExpenseDetailDialog from "./ExpenseDetailDialog";
import { useExpenseMutations } from "@/hooks/expenses";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExpenseTableRowProps {
  expense: Expense;
  currency: Currency;
}

const ExpenseTableRow = ({ expense, currency }: ExpenseTableRowProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteExpense } = useExpenseMutations(expense.paidBy);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteExpense.mutateAsync(expense.id);
      setShowDeleteDialog(false);
      toast.success(`Expense "${expense.description}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/expense/${expense.id}`);
  };

  const handleEdit = () => {
    navigate(`/expense/${expense.id}`);
  };

  const canEdit = expense.status !== 'paid';

  const formatSplitMethod = () => {
    if (expense.splitMethod === '50/50') {
      return '50/50 Split';
    } else if (expense.splitMethod === 'custom') {
      if (expense.splitPercentage && Object.keys(expense.splitPercentage).length > 0) {
        return `Custom Split (%)`;
      } else if (expense.splitAmounts && Object.keys(expense.splitAmounts).length > 0) {
        return `Custom Split ($)`;
      } else if (expense.childSplitAmounts && Object.keys(expense.childSplitAmounts).length > 0) {
        return `Split by Child`;
      } else {
        return 'Custom Split';
      }
    } else {
      return expense.splitMethod;
    }
  };

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
        <TableCell>{formatSplitMethod()}</TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end space-x-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/expense/${expense.id}`)}>
              <Eye className="h-4 w-4" />
            </Button>
            {canEdit && (
              <Button variant="ghost" size="sm" onClick={() => navigate(`/expense/${expense.id}`)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {canEdit && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:text-red-700"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <ExpenseStatusMenu 
              expenseId={expense.id}
              currentStatus={expense.status}
              isProcessing={isDeleting || isUpdating}
              onStatusChange={() => setIsUpdating(true)}
              onDelete={() => setIsDeleting(true)}
              expense={expense}
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={async () => {
                try {
                  setIsDeleting(true);
                  await deleteExpense.mutateAsync(expense.id);
                  setShowDeleteDialog(false);
                  toast.success(`Expense "${expense.description}" deleted successfully`);
                } catch (error) {
                  console.error("Error deleting expense:", error);
                  toast.error("Failed to delete expense");
                } finally {
                  setIsDeleting(false);
                }
              }} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExpenseTableRow;
