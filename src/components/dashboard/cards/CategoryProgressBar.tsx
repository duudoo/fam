
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/utils/expenseUtils';
import { Currency } from '@/contexts/CurrencyContext';

export interface CategoryProgressBarProps {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  currency?: Currency;
}

const CategoryProgressBar = ({ 
  name, 
  amount, 
  percentage, 
  color,
  currency = { code: 'USD', symbol: '$', name: 'US Dollar' }
}: CategoryProgressBarProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
        <span className="text-sm font-medium">{name}</span>
      </div>
      <span className="text-sm font-medium">{formatCurrency(amount, currency.symbol)}</span>
    </div>
    <Progress value={percentage} className="h-2 bg-gray-100" />
  </div>
);

export default CategoryProgressBar;
