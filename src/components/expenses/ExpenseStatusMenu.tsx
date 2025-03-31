
import { FC, useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Check, 
  HelpCircle, 
  CreditCard, 
  Trash,
  HelpCircle as QuestionIcon,
  Share2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useExpenseStatus } from '@/hooks/expenses/useExpenseStatus';
import DisputeDialog from '@/components/expenses/detail/DisputeDialog';
import ShareExpenseDialog from '@/components/expenses/share/ShareExpenseDialog';
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
import { Expense } from '@/utils/types';

interface ExpenseStatusMenuProps {
  expenseId: string;
  currentStatus: string;
  isProcessing?: boolean;
  onStatusChange: () => void;
  onDelete: () => void;
  expense?: Expense; // Add the expense prop for sharing
}

const ExpenseStatusMenu: FC<ExpenseStatusMenuProps> = ({ 
  expenseId, 
  currentStatus, 
  isProcessing: externalProcessing = false,
  onStatusChange,
  onDelete,
  expense
}) => {
  const { user } = useAuth();
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  const { isProcessing, updateStatus } = useExpenseStatus({
    expenseId,
    userId: user?.id,
    onSuccess: onStatusChange
  });

  const handleUpdateStatus = (status: 'approved' | 'disputed' | 'paid' | 'pending') => {
    updateStatus(status);
  };
  
  const handleDisputeSubmit = async (note: string) => {
    await updateStatus('disputed', note);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    onDelete();
  };

  const isDisabled = isProcessing || externalProcessing;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" disabled={isDisabled}>
          <MoreVertical className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {currentStatus !== 'approved' && (
            <DropdownMenuItem onClick={() => handleUpdateStatus('approved')}>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Approve
            </DropdownMenuItem>
          )}
          {currentStatus !== 'paid' && currentStatus === 'approved' && (
            <DropdownMenuItem onClick={() => handleUpdateStatus('paid')}>
              <CreditCard className="mr-2 h-4 w-4 text-blue-500" />
              Mark as Paid
            </DropdownMenuItem>
          )}
          {currentStatus !== 'disputed' && (
            <DropdownMenuItem onClick={() => setDisputeDialogOpen(true)}>
              <QuestionIcon className="mr-2 h-4 w-4 text-amber-500" />
              Clarify
            </DropdownMenuItem>
          )}
          {currentStatus !== 'pending' && (
            <DropdownMenuItem onClick={() => handleUpdateStatus('pending')}>
              <HelpCircle className="mr-2 h-4 w-4 text-amber-500" />
              Mark as Pending
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>
            <Share2 className="mr-2 h-4 w-4 text-blue-500" />
            Share
          </DropdownMenuItem>
          {currentStatus !== 'paid' && (
            <DropdownMenuItem 
              className="text-red-600" 
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DisputeDialog
        open={disputeDialogOpen}
        onOpenChange={setDisputeDialogOpen}
        onDisputeSubmit={handleDisputeSubmit}
        isProcessing={isDisabled}
      />

      {expense && (
        <ShareExpenseDialog 
          expense={expense}
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExpenseStatusMenu;
