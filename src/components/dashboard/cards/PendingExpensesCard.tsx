
import { FileText, BanknoteIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/utils/types';
import { formatCurrency } from '@/utils/expenseUtils';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PendingExpensesCardProps {
  pendingExpenses: Expense[];
}

const PendingExpensesCard = ({ pendingExpenses }: PendingExpensesCardProps) => {
  const { user } = useAuth();
  const { currency } = useCurrency();

  const calculateUserOwedAmount = () => {
    if (!user) return 0;
    
    return pendingExpenses.reduce((total, expense) => {
      // Only consider expenses paid by the current user
      if (expense.paidBy === user.id) {
        // For custom split with explicit split percentages
        if (expense.splitMethod === 'custom' && expense.splitPercentage) {
          // Calculate co-parent percentage (everything not assigned to current user)
          const userPercentage = expense.splitPercentage[user.id] || 0;
          const coParentPercentage = 100 - userPercentage;
          // Calculate amount owed based on co-parent's percentage
          return total + (expense.amount * coParentPercentage / 100);
        } 
        // For custom split with explicit split amounts
        else if (expense.splitMethod === 'custom' && expense.splitAmounts) {
          // Find all user IDs in the splitAmounts
          const allUserIds = Object.keys(expense.splitAmounts);
          // Filter out the current user to get co-parent IDs
          const coParentIds = allUserIds.filter(id => id !== user.id);
          
          // Sum up the amounts owed by co-parents
          const coParentTotal = coParentIds.reduce((sum, coParentId) => {
            return sum + (expense.splitAmounts?.[coParentId] || 0);
          }, 0);
          
          return total + coParentTotal;
        }
        // For 50/50 split
        else if (expense.splitMethod === '50/50') {
          return total + (expense.amount / 2);
        }
        // For no split (user pays all) or default case, nothing is owed
        return total;
      }
      return total;
    }, 0);
  };

  const owedAmount = calculateUserOwedAmount();

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-famacle-teal" />
          Pending Approval
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-famacle-slate">{pendingExpenses.length}</div>
        <p className="text-gray-500 text-sm">
          {pendingExpenses.length > 0 
            ? `${formatCurrency(pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0), currency.symbol)} total pending`
            : 'No pending expenses'}
        </p>
        
        {owedAmount > 0 && (
          <p className="text-green-600 text-sm mt-1">
            {formatCurrency(owedAmount, currency.symbol)} owed to you
          </p>
        )}
      </CardContent>
      <div className="absolute top-0 right-0 p-3">
        <BanknoteIcon className="w-6 h-6 text-famacle-teal" />
      </div>
    </Card>
  );
};

export default PendingExpensesCard;
