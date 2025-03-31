
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
  X, 
  HelpCircle, 
  CreditCard, 
  Trash 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useExpenseStatus } from '@/hooks/expenses/useExpenseStatus';
import DisputeDialog from '@/components/expenses/detail/DisputeDialog';

interface ExpenseStatusMenuProps {
  expenseId: string;
  currentStatus: string;
  isProcessing?: boolean;
  onStatusChange: () => void;
  onDelete: () => void;
}

const ExpenseStatusMenu: FC<ExpenseStatusMenuProps> = ({ 
  expenseId, 
  currentStatus, 
  isProcessing: externalProcessing = false,
  onStatusChange,
  onDelete
}) => {
  const { user } = useAuth();
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  
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
              <X className="mr-2 h-4 w-4 text-red-500" />
              Dispute
            </DropdownMenuItem>
          )}
          {currentStatus !== 'pending' && (
            <DropdownMenuItem onClick={() => handleUpdateStatus('pending')}>
              <HelpCircle className="mr-2 h-4 w-4 text-amber-500" />
              Mark as Pending
            </DropdownMenuItem>
          )}
          {currentStatus !== 'paid' && (
            <DropdownMenuItem className="text-red-600" onClick={onDelete}>
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
    </>
  );
};

export default ExpenseStatusMenu;
