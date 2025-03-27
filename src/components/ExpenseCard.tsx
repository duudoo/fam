
import { FC } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  DollarSign, 
  FileText, 
  Tag, 
  User, 
  Check, 
  X, 
  HelpCircle, 
  CreditCard,
  MoreVertical,
  Trash
} from 'lucide-react';
import { Expense } from '@/utils/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

interface ExpenseCardProps {
  expense: Expense;
  className?: string;
}

const ExpenseCard: FC<ExpenseCardProps> = ({ expense, className }) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'approved':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'disputed':
        return <X className="w-4 h-4 text-red-500" />;
      case 'paid':
        return <CreditCard className="w-4 h-4 text-green-500" />;
      case 'pending':
      default:
        return <HelpCircle className="w-4 h-4 text-amber-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'disputed':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'paid':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'medical':
        return 'bg-famacle-coral-light text-famacle-coral border-famacle-coral/20';
      case 'education':
        return 'bg-famacle-blue-light text-famacle-blue border-famacle-blue/20';
      case 'clothing':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'activities':
        return 'bg-famacle-teal-light text-famacle-teal border-famacle-teal/20';
      case 'food':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const updateExpenseStatus = async (status: 'approved' | 'disputed' | 'paid' | 'pending') => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('expenses')
        .update({ status })
        .eq('id', expense.id);
        
      if (error) throw error;
      
      toast.success(`Expense marked as ${status}`);
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    } catch (error) {
      console.error('Error updating expense status:', error);
      toast.error('Failed to update expense status');
    } finally {
      setIsUpdating(false);
    }
  };
  
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
          <Badge variant="outline" className={getStatusColor(expense.status)}>
            <span className="flex items-center gap-1">
              {getStatusIcon(expense.status)}
              <span className="capitalize">{expense.status}</span>
            </span>
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <MoreVertical className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {expense.status !== 'approved' && (
                <DropdownMenuItem onClick={() => updateExpenseStatus('approved')}>
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  Mark as Approved
                </DropdownMenuItem>
              )}
              {expense.status !== 'paid' && expense.status === 'approved' && (
                <DropdownMenuItem onClick={() => updateExpenseStatus('paid')}>
                  <CreditCard className="mr-2 h-4 w-4 text-blue-500" />
                  Mark as Paid
                </DropdownMenuItem>
              )}
              {expense.status !== 'disputed' && (
                <DropdownMenuItem onClick={() => updateExpenseStatus('disputed')}>
                  <X className="mr-2 h-4 w-4 text-red-500" />
                  Mark as Disputed
                </DropdownMenuItem>
              )}
              {expense.status !== 'pending' && (
                <DropdownMenuItem onClick={() => updateExpenseStatus('pending')}>
                  <HelpCircle className="mr-2 h-4 w-4 text-amber-500" />
                  Mark as Pending
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-red-600" onClick={deleteExpense}>
                <Trash className="mr-2 h-4 w-4" />
                Delete Expense
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium text-famacle-slate">${expense.amount.toFixed(2)}</span>
        </div>
        
        <Badge variant="outline" className={getCategoryColor(expense.category)}>
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span className="capitalize">{expense.category}</span>
          </span>
        </Badge>
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
