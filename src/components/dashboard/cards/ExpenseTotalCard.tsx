
import { CircleDollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/utils/expenseUtils';

interface ExpenseTotalCardProps {
  total: number;
}

const ExpenseTotalCard = ({ total }: ExpenseTotalCardProps) => {
  const { currency } = useCurrency();
  
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
          <CircleDollarSign className="w-5 h-5 mr-2 text-famacle-blue" />
          Total Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-famacle-slate">{formatCurrency(total, currency.symbol)}</div>
        <p className="text-gray-500 text-sm">Last updated today</p>
      </CardContent>
      <div className="absolute top-0 right-0 p-3">
        <Avatar className="h-10 w-10 border-2 border-white">
          <AvatarFallback>{currency.symbol}</AvatarFallback>
        </Avatar>
      </div>
    </Card>
  );
};

export default ExpenseTotalCard;
