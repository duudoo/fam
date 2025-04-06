
import { Control, useWatch } from 'react-hook-form';
import { FormValues } from './schema';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/utils/expenseUtils';
import { useAuth } from '@/hooks/useAuth';

interface SplitPreviewProps {
  control: Control<FormValues>;
}

const SplitPreview = ({ control }: SplitPreviewProps) => {
  const { currency } = useCurrency();
  const { user } = useAuth();
  const amount = useWatch({ control, name: 'amount' });
  const splitMethod = useWatch({ control, name: 'splitMethod' });
  const splitPercentage = useWatch({ control, name: 'splitPercentage' }) || { you: 50, coparent: 50 };
  const splitAmounts = useWatch({ control, name: 'splitAmounts' });
  const childSplitAmounts = useWatch({ control, name: 'childSplitAmounts' });
  
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
        // Handle different custom split types
        if (splitPercentage && user && splitPercentage[user.id]) {
          // Percentage-based split
          const yourPercentage = splitPercentage[user.id];
          const coParentPercentage = splitPercentage.coParent || (100 - yourPercentage);
          const yourAmount = numericAmount * (yourPercentage / 100);
          const theirAmount = numericAmount * (coParentPercentage / 100);
          
          return (
            <div className="text-sm">
              <p>You pay: {formatCurrency(yourAmount, currency.symbol)} ({yourPercentage}%)</p>
              <p>Co-parent pays: {formatCurrency(theirAmount, currency.symbol)} ({coParentPercentage}%)</p>
            </div>
          );
        } 
        else if (splitAmounts && user && splitAmounts[user.id] !== undefined) {
          // Amount-based split
          const yourAmount = splitAmounts[user.id];
          const theirAmount = splitAmounts.coParent || (numericAmount - yourAmount);
          
          return (
            <div className="text-sm">
              <p>You pay: {formatCurrency(yourAmount, currency.symbol)}</p>
              <p>Co-parent pays: {formatCurrency(theirAmount, currency.symbol)}</p>
            </div>
          );
        }
        else if (childSplitAmounts && Object.keys(childSplitAmounts).length > 0) {
          // Child-specific split
          const totalAllocated = Object.values(childSplitAmounts).reduce((sum, value) => sum + Number(value), 0);
          
          return (
            <div className="text-sm">
              <p>Split by child: {formatCurrency(totalAllocated, currency.symbol)}</p>
              {totalAllocated !== numericAmount && (
                <p className="text-amber-600">
                  {totalAllocated < numericAmount ? 'Under-allocated' : 'Over-allocated'}: {formatCurrency(Math.abs(totalAllocated - numericAmount), currency.symbol)}
                </p>
              )}
            </div>
          );
        }
        // Fallback if custom is selected but no specific split is defined yet
        return (
          <div className="text-sm">
            <p>Custom split not configured</p>
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
