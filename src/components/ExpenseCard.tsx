
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
  CreditCard 
} from 'lucide-react';
import { Expense } from '@/utils/types';
import { mockParents } from '@/utils/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ExpenseCardProps {
  expense: Expense;
  className?: string;
}

const ExpenseCard: FC<ExpenseCardProps> = ({ expense, className }) => {
  const parentName = mockParents.find(p => p.id === expense.paidBy)?.name || 'Unknown';
  
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

  return (
    <div 
      className={cn(
        "p-4 rounded-xl bg-white border border-gray-100 shadow-soft transition-all duration-300 hover:shadow-md scale-in-transition", 
        className
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-lg text-famacle-slate">{expense.description}</h3>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className={getStatusColor(expense.status)}>
            <span className="flex items-center gap-1">
              {getStatusIcon(expense.status)}
              <span className="capitalize">{expense.status}</span>
            </span>
          </Badge>
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
        
        <div className="flex items-center gap-1">
          <User className="w-4 h-4 text-gray-400" />
          <span>{parentName}</span>
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
