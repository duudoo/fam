
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useExpenseDetail } from "@/hooks/expenses/useExpenseDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash } from "lucide-react";
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
import ExpenseDetailContent from "@/components/expenses/detail/ExpenseDetailContent";
import ExpenseDetailSkeleton from "@/components/expenses/detail/ExpenseDetailSkeleton";
import ExpenseNotFound from "@/components/expenses/detail/ExpenseNotFound";
import ExpenseDetailError from "@/components/expenses/detail/ExpenseDetailError";
import ExpenseForm from "@/components/expenses/form/ExpenseForm";
import { useCurrency } from "@/contexts/CurrencyContext";

const ExpenseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const { 
    expense, 
    loading, 
    error,
    isDeleting,
    handleDelete,
    handleStatusChange
  } = useExpenseDetail(id);

  const canEdit = expense?.status !== 'paid' && expense?.paidBy === user?.id;

  const handleDeleteConfirm = async () => {
    if (expense) {
      await handleDelete(expense.id);
    }
  };

  if (loading) {
    return <ExpenseDetailSkeleton />;
  }

  if (error) {
    return <ExpenseDetailError error={error} />;
  }

  if (!expense) {
    return <ExpenseNotFound />;
  }

  if (isEditing) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 flex items-center gap-2" 
          onClick={() => setIsEditing(false)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Details
        </Button>
        <ExpenseForm
          expense={expense}
          onExpenseAdded={() => {
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2" 
          onClick={() => navigate("/expenses")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Expenses
        </Button>
        {canEdit && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4" />
              Edit Expense
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <Trash className="w-4 h-4" />
              Delete
            </Button>
          </div>
        )}
      </div>
      
      <ExpenseDetailContent 
        expense={expense}
        currentUserId={user?.id || ''}
        currency={currency}
        isDeleting={isDeleting}
        onStatusChange={handleStatusChange}
        onDelete={() => setShowDeleteDialog(true)}
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
              onClick={handleDeleteConfirm} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpenseDetail;
