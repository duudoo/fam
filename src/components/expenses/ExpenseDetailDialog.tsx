
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
              <p className="text-sm text-gray-500">{expense.splitMethod}</p>
              {expense.splitPercentage && (
                <div className="text-xs text-gray-500 mt-1">
                  {Object.entries(expense.splitPercentage).map(([id, percentage]) => (
                    <div key={id}>User {id}: {percentage}%</div>
                  ))}
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
