
import { Control, useWatch } from 'react-hook-form';
import { FormValues } from './schema';
import { useCurrency } from '@/contexts/CurrencyContext';

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
            <p>You pay: {currency.symbol}{halfAmount.toFixed(2)}</p>
            <p>Co-parent pays: {currency.symbol}{halfAmount.toFixed(2)}</p>
          </div>
        );
      case 'custom':
        const yourAmount = (numericAmount * (splitPercentage.you / 100)).toFixed(2);
        const theirAmount = (numericAmount * (splitPercentage.coparent / 100)).toFixed(2);
        return (
          <div className="text-sm">
            <p>You pay: {currency.symbol}{yourAmount} ({splitPercentage.you}%)</p>
            <p>Co-parent pays: {currency.symbol}{theirAmount} ({splitPercentage.coparent}%)</p>
          </div>
        );
      default:
        return (
          <div className="text-sm">
            <p>You pay: {currency.symbol}{numericAmount.toFixed(2)}</p>
            <p>Co-parent pays: {currency.symbol}0.00</p>
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
