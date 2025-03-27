
import { FileText, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/utils/types';

interface PendingExpensesCardProps {
  pendingExpenses: Expense[];
}

const PendingExpensesCard = ({ pendingExpenses }: PendingExpensesCardProps) => (
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
          ? `$${pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)} pending`
          : 'No pending expenses'}
      </p>
    </CardContent>
    <div className="absolute top-0 right-0 p-3">
      <CreditCard className="w-6 h-6 text-famacle-teal" />
    </div>
  </Card>
);

export default PendingExpensesCard;
