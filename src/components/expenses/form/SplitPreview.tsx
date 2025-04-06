
import { Control, useWatch } from 'react-hook-form';
import { FormValues } from './schema';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/utils/expenseUtils';

interface SplitPreviewProps {
  control: Control<FormValues>;
}

const SplitPreview = ({ control }: SplitPreviewProps) => {
  const { currency } = useCurrency();
  const amount = useWatch({ control, name: 'amount' });
  const splitMethod = useWatch({ control, name: 'splitMethod' });
  const splitPercentage = useWatch({ control, name: 'splitPercentage' }) || { you: 50, coparent: 50 };
  
  if (!amount || parseFloat(amount) === 0) return null;
  
  const numericAmount = parseFloat(amount);
  
  const renderSplitDetails = () => {
    switch (splitMethod) {
      case '50/50':
        const halfAmount = numericAmount / 2;
        return (
          <div className="text-sm">
            <p>You pay: {formatCurrency(halfAmount, currency.symbol)}</p>
            <p>Co-parent pays: {formatCurrency(halfAmount, currency.symbol)}</p>
          </div>
        );
      case 'custom':
        const yourAmount = numericAmount * (splitPercentage.you / 100);
        const theirAmount = numericAmount * (splitPercentage.coparent / 100);
        return (
          <div className="text-sm">
            <p>You pay: {formatCurrency(yourAmount, currency.symbol)} ({splitPercentage.you}%)</p>
            <p>Co-parent pays: {formatCurrency(theirAmount, currency.symbol)} ({splitPercentage.coparent}%)</p>
          </div>
        );
      default:
        return (
          <div className="text-sm">
            <p>You pay: {formatCurrency(numericAmount, currency.symbol)}</p>
            <p>Co-parent pays: {formatCurrency(0, currency.symbol)}</p>
          </div>
        );
    }
  };
  
  return (
    <div className="mt-2 p-3 bg-muted rounded-md">
      <h4 className="font-medium mb-1">Split Preview</h4>
      {renderSplitDetails()}
    </div>
  );
};

export default SplitPreview;
