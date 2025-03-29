
import { FileText, CreditCard } from 'lucide-react';
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
      if (expense.paidBy === user.id) {
        if (expense.splitAmounts) {
          const userShare = expense.splitAmounts[user.id] || 0;
          return total + (expense.amount - userShare);
        } 
        else if (expense.splitMethod === '50/50') {
          return total + (expense.amount / 2);
        }
        else {
          return total + expense.amount;
        }
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
        <CreditCard className="w-6 h-6 text-famacle-teal" />
      </div>
    </Card>
  );
};

export default PendingExpensesCard;
