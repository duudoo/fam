
import { FC } from 'react';
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
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface ExpenseStatusMenuProps {
  expenseId: string;
  currentStatus: string;
  isProcessing: boolean;
  onStatusChange: () => void;
  onDelete: () => void;
}

const ExpenseStatusMenu: FC<ExpenseStatusMenuProps> = ({ 
  expenseId, 
  currentStatus, 
  isProcessing,
  onStatusChange,
  onDelete
}) => {
  const queryClient = useQueryClient();

  const updateExpenseStatus = async (status: 'approved' | 'disputed' | 'paid' | 'pending') => {
    onStatusChange();
    try {
      const { error } = await supabase
        .from('expenses')
        .update({ status })
        .eq('id', expenseId);
        
      if (error) throw error;
      
      toast.success(`Expense marked as ${status}`);
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    } catch (error) {
      console.error('Error updating expense status:', error);
      toast.error('Failed to update expense status');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" disabled={isProcessing}>
        <MoreVertical className="h-5 w-5 text-gray-500 hover:text-gray-700" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currentStatus !== 'approved' && (
          <DropdownMenuItem onClick={() => updateExpenseStatus('approved')}>
            <Check className="mr-2 h-4 w-4 text-green-500" />
            Mark as Approved
          </DropdownMenuItem>
        )}
        {currentStatus !== 'paid' && currentStatus === 'approved' && (
          <DropdownMenuItem onClick={() => updateExpenseStatus('paid')}>
            <CreditCard className="mr-2 h-4 w-4 text-blue-500" />
            Mark as Paid
          </DropdownMenuItem>
        )}
        {currentStatus !== 'disputed' && (
          <DropdownMenuItem onClick={() => updateExpenseStatus('disputed')}>
            <X className="mr-2 h-4 w-4 text-red-500" />
            Mark as Disputed
          </DropdownMenuItem>
        )}
        {currentStatus !== 'pending' && (
          <DropdownMenuItem onClick={() => updateExpenseStatus('pending')}>
            <HelpCircle className="mr-2 h-4 w-4 text-amber-500" />
            Mark as Pending
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="text-red-600" onClick={onDelete}>
          <Trash className="mr-2 h-4 w-4" />
          Delete Expense
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExpenseStatusMenu;
