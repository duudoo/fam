
import { useState, useEffect } from 'react';
import { useFormContext, Control } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/hooks/useAuth';
import { FormValues } from './schema';
import { formatCurrency } from '@/utils/expenseUtils';

interface SplitPreviewProps {
  control: Control<FormValues>;
}

const SplitPreview = ({ control }: SplitPreviewProps) => {
  const { user } = useAuth();
  const { watch } = useFormContext();
  const { currency } = useCurrency();
  
  const [userAmount, setUserAmount] = useState<number>(0);
  const [coParentAmount, setCoParentAmount] = useState<number>(0);
  const [childrenAmounts, setChildrenAmounts] = useState<{[key: string]: number}>({});
  
  // Watch for form value changes
  const amount = watch('amount');
  const parsedAmount = parseFloat(amount) || 0;
  const splitMethod = watch('splitMethod');
  const splitPercentage = watch('splitPercentage');
  const splitAmounts = watch('splitAmounts');
  const childSplitAmounts = watch('childSplitAmounts');
  const selectedChildIds = watch('childIds') || [];
  
  // Calculate split amounts whenever relevant fields change
  useEffect(() => {
    // Reset values
    setUserAmount(0);
    setCoParentAmount(0);
    setChildrenAmounts({});
    
    if (!user || parsedAmount <= 0) return;
    
    if (splitMethod === 'none') {
      setUserAmount(parsedAmount);
    } 
    else if (splitMethod === '50/50') {
      const halfAmount = parsedAmount / 2;
      setUserAmount(halfAmount);
      setCoParentAmount(halfAmount);
    } 
    else if (splitMethod === 'custom') {
      if (splitPercentage && Object.keys(splitPercentage).length > 0) {
        // Percentage-based split
        const userPercent = splitPercentage[user.id] || 0;
        const coParentPercent = splitPercentage['coParent'] || 0;
        
        setUserAmount((userPercent / 100) * parsedAmount);
        setCoParentAmount((coParentPercent / 100) * parsedAmount);
      } 
      else if (splitAmounts && Object.keys(splitAmounts).length > 0) {
        // Fixed amount split
        setUserAmount(splitAmounts[user.id] || 0);
        setCoParentAmount(splitAmounts['coParent'] || 0);
      }
      else if (childSplitAmounts && Object.keys(childSplitAmounts).length > 0) {
        // Child-specific split
        setChildrenAmounts(childSplitAmounts);
      }
      else if (selectedChildIds.length > 0) {
        // Default to equal split among children
        const perChildAmount = parsedAmount / selectedChildIds.length;
        const newChildAmounts: {[key: string]: number} = {};
        
        selectedChildIds.forEach(childId => {
          newChildAmounts[childId] = perChildAmount;
        });
        
        setChildrenAmounts(newChildAmounts);
      }
    }
  }, [parsedAmount, splitMethod, splitPercentage, splitAmounts, childSplitAmounts, user, selectedChildIds]);
  
  // Display nothing if no amount or split method
  if (parsedAmount <= 0 || !splitMethod) {
    return null;
  }
  
  // Get total of all splits to verify correctness
  const totalAmount = userAmount + coParentAmount + 
    Object.values(childrenAmounts).reduce((sum, val) => sum + val, 0);
  
  // Check if the split amount is different from total
  const hasSplitDiscrepancy = Math.abs(totalAmount - parsedAmount) > 0.01;
  
  return (
    <Card className="mt-2">
      <CardContent className="pt-5">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Split Preview</h4>
          
          {(userAmount > 0 || splitMethod === 'none') && (
            <div className="flex justify-between text-sm">
              <span>You pay:</span>
              <span className="font-medium">{formatCurrency(userAmount, currency.symbol)}</span>
            </div>
          )}
          
          {coParentAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span>Co-parent pays:</span>
              <span className="font-medium">{formatCurrency(coParentAmount, currency.symbol)}</span>
            </div>
          )}
          
          {Object.keys(childrenAmounts).length > 0 && (
            <>
              <div className="text-sm font-medium mt-2">Child expenses:</div>
              {Object.entries(childrenAmounts).map(([childId, amount]) => (
                <div key={childId} className="flex justify-between text-sm pl-2">
                  <span>Child {childId.substring(0, 4)}:</span>
                  <span>{formatCurrency(amount, currency.symbol)}</span>
                </div>
              ))}
            </>
          )}
          
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Total:</span>
              <span className={hasSplitDiscrepancy ? "text-red-500" : ""}>
                {formatCurrency(totalAmount, currency.symbol)}
                {hasSplitDiscrepancy && ` (expected: ${formatCurrency(parsedAmount, currency.symbol)})`}
              </span>
            </div>
          </div>
          
          {hasSplitDiscrepancy && (
            <div className="text-xs text-red-500 mt-1">
              Warning: Split amounts don't add up to the total expense amount.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SplitPreview;
