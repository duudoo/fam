
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
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { expensesAPI } from '@/lib/api/expenses';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
  const { user } = useAuth();
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  const [disputeNote, setDisputeNote] = useState("");

  const updateExpenseStatus = async (status: 'approved' | 'disputed' | 'paid' | 'pending', note?: string) => {
    if (!user) return;
    
    onStatusChange();
    try {
      await expensesAPI.updateExpenseStatus(expenseId, status, user.id, note);
      
      let message = "";
      switch (status) {
        case 'approved':
          message = "Expense approved";
          break;
        case 'disputed':
          message = "Expense disputed";
          break;
        case 'paid':
          message = "Expense marked as paid";
          break;
        case 'pending':
          message = "Expense marked as pending";
          break;
      }
      
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    } catch (error) {
      console.error('Error updating expense status:', error);
      toast.error('Failed to update expense status');
    }
  };
  
  const handleDisputeSubmit = async () => {
    if (!disputeNote.trim()) {
      toast.error("Please provide a reason for the dispute");
      return;
    }
    
    await updateExpenseStatus('disputed', disputeNote);
    setDisputeDialogOpen(false);
    setDisputeNote("");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" disabled={isProcessing}>
          <MoreVertical className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {currentStatus !== 'approved' && (
            <DropdownMenuItem onClick={() => updateExpenseStatus('approved')}>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Approve
            </DropdownMenuItem>
          )}
          {currentStatus !== 'paid' && currentStatus === 'approved' && (
            <DropdownMenuItem onClick={() => updateExpenseStatus('paid')}>
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
            <DropdownMenuItem onClick={() => updateExpenseStatus('pending')}>
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
      
      <Dialog open={disputeDialogOpen} onOpenChange={setDisputeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispute Expense</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium">Reason for dispute</label>
            <Textarea
              className="mt-2"
              placeholder="Please explain why you're disputing this expense..."
              value={disputeNote}
              onChange={(e) => setDisputeNote(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisputeDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDisputeSubmit}
              disabled={!disputeNote.trim()}
            >
              Dispute Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpenseStatusMenu;
