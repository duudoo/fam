
import { FC, useState } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  DollarSign, 
  FileText, 
  User
} from 'lucide-react';
import { Expense } from '@/utils/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import StatusBadge from '@/components/expenses/StatusBadge';
import CategoryBadge from '@/components/expenses/CategoryBadge';
import ExpenseStatusMenu from '@/components/expenses/ExpenseStatusMenu';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/utils/expenseUtils';

interface ExpenseCardProps {
  expense: Expense;
  className?: string;
}

const ExpenseCard: FC<ExpenseCardProps> = ({ expense, className }) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { currency } = useCurrency();
  
  const deleteExpense = async () => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expense.id);
        
      if (error) throw error;
      
      toast.success('Expense deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className={cn(
        "p-4 rounded-xl bg-white border border-gray-100 shadow-soft transition-all duration-300 hover:shadow-md", 
        className,
        (isDeleting || isUpdating) && "opacity-60 pointer-events-none"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-lg text-famacle-slate">{expense.description}</h3>
        <div className="flex items-center gap-2">
          <StatusBadge status={expense.status} />
          
          <ExpenseStatusMenu 
            expenseId={expense.id}
            currentStatus={expense.status}
            isProcessing={isDeleting || isUpdating}
            onStatusChange={() => setIsUpdating(true)}
            onDelete={deleteExpense}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium text-famacle-slate">{formatCurrency(expense.amount, currency.symbol)}</span>
        </div>
        
        <CategoryBadge category={expense.category} />
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
        </div>
        
        <div className="flex items-center gap-1 col-span-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span>Split: {expense.splitMethod}</span>
        </div>
      </div>
      
      {expense.notes && (
        <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-2 rounded-md">
          {expense.notes}
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;
