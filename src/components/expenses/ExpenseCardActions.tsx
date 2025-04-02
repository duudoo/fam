
import { Button } from "@/components/ui/button";
import { useExpenseMutations } from "@/hooks/expenses";
import { Expense } from "@/utils/types";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
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
import { toast } from "sonner";

interface ExpenseCardActionsProps {
  expense: Expense;
  onEdit: () => void;
}

const ExpenseCardActions = ({ expense, onEdit }: ExpenseCardActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  return (
    <>
      <div className="flex justify-end space-x-2 border-t pt-3 mt-3">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit2 className="h-3.5 w-3.5 mr-1" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 hover:text-red-700" 
          onClick={() => setShowDeleteDialog(true)}
          disabled={isDeleting}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>

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
              onClick={handleDelete} 
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

export default ExpenseCardActions;
