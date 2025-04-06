
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Expense } from "@/utils/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Receipt, Users } from "lucide-react";
import StatusBadge from "./StatusBadge";
import CategoryBadge from "./CategoryBadge";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatCurrency } from "@/utils/expenseUtils";
import { useChildren } from "@/hooks/children";

interface ExpenseDetailDialogProps {
  expense: Expense;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

const ExpenseDetailDialog = ({ expense, open, onOpenChange, onEdit }: ExpenseDetailDialogProps) => {
  const { currency } = useCurrency();
  const { data: children = [] } = useChildren();
  const canEdit = expense.status !== 'paid';
  
  const relatedChildren = children.filter(child => 
    expense.childIds?.includes(child.id)
  );

  // Helper function to render the split details
  const renderSplitDetails = () => {
    if (expense.splitMethod === '50/50') {
      const halfAmount = expense.amount / 2;
      return `Equal 50/50 split (${formatCurrency(halfAmount, currency.symbol)} each)`;
    } else if (expense.splitMethod === 'custom') {
      if (expense.splitPercentage && Object.keys(expense.splitPercentage).length > 0) {
        // For percentage-based splits
        const percentages = Object.entries(expense.splitPercentage)
          .map(([key, value]) => `${key === 'coParent' ? 'Co-parent' : 'You'}: ${value}%`)
          .join(', ');
        return `Custom percentage split (${percentages})`;
      } else if (expense.splitAmounts && Object.keys(expense.splitAmounts).length > 0) {
        // For amount-based splits
        const amounts = Object.entries(expense.splitAmounts)
          .map(([key, value]) => `${key === 'coParent' ? 'Co-parent' : 'You'}: ${formatCurrency(value, currency.symbol)}`)
          .join(', ');
        return `Custom amount split (${amounts})`;
      } else if (expense.childSplitAmounts && Object.keys(expense.childSplitAmounts).length > 0) {
        // For child-specific splits
        return `Split by child allocation`;
      } else {
        return 'Custom split';
      }
    } else {
      return expense.splitMethod;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {expense.description}
            <StatusBadge status={expense.status} />
          </DialogTitle>
          <DialogDescription>
            {formatCurrency(expense.amount, currency.symbol)} - <CategoryBadge category={expense.category} />
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 mt-0.5 text-gray-500" />
            <div>
              <p className="font-medium">Date</p>
              <p className="text-sm text-gray-500">{format(new Date(expense.date), 'MMMM d, yyyy')}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 mt-0.5 text-gray-500" />
            <div>
              <p className="font-medium">Split Method</p>
              <p className="text-sm text-gray-500">{renderSplitDetails()}</p>
              {expense.childSplitAmounts && Object.keys(expense.childSplitAmounts).length > 0 && (
                <div className="mt-1 text-xs space-y-1">
                  {Object.entries(expense.childSplitAmounts).map(([childId, amount]) => {
                    const child = children.find(c => c.id === childId);
                    return (
                      <p key={childId}>
                        {child ? (child.name || child.initials) : 'Child'}: {formatCurrency(Number(amount), currency.symbol)}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          {relatedChildren.length > 0 && (
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 mt-0.5 text-gray-500" />
              <div>
                <p className="font-medium">Children</p>
                <p className="text-sm text-gray-500">
                  {relatedChildren.map(c => c.name || c.initials).join(', ')}
                </p>
              </div>
            </div>
          )}
          
          {expense.receiptUrl && (
            <div className="flex items-start gap-2">
              <Receipt className="w-4 h-4 mt-0.5 text-gray-500" />
              <div>
                <p className="font-medium">Receipt</p>
                <a 
                  href={expense.receiptUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  View Receipt
                </a>
              </div>
            </div>
          )}
          
          {expense.notes && (
            <div className="mt-2">
              <p className="font-medium">Notes</p>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-1">{expense.notes}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {canEdit && onEdit && (
            <Button onClick={onEdit}>
              Edit Expense
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseDetailDialog;
