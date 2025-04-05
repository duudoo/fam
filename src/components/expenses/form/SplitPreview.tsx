
import { useMemo } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { FormValues } from './schema';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useChildren } from '@/hooks/children';
import { formatCurrency } from '@/utils/expenseUtils';
import { useCurrency } from '@/contexts/CurrencyContext';

interface SplitPreviewProps {
  control: Control<FormValues>;
}

const SplitPreview = ({ control }: SplitPreviewProps) => {
  const { user } = useAuth();
  const { data: children = [] } = useChildren();
  const { currency } = useCurrency();
  
  // Watch the form values we need
  const amount = parseFloat(useWatch({ control, name: 'amount' }) || '0');
  const splitMethod = useWatch({ control, name: 'splitMethod' });
  const splitPercentage = useWatch({ control, name: 'splitPercentage' });
  const splitAmounts = useWatch({ control, name: 'splitAmounts' });
  const childSplitAmounts = useWatch({ control, name: 'childSplitAmounts' });
  const childIds = useWatch({ control, name: 'childIds' }) || [];
  
  // Calculate the split based on the selected method
  const splitSummary = useMemo(() => {
    if (!user) return null;
    
    if (splitMethod === 'none') {
      return {
        userAmount: amount,
        coParentAmount: 0,
        childAmounts: {}
      };
    }
    
    if (splitMethod === '50/50') {
      const halfAmount = amount / 2;
      return {
        userAmount: halfAmount,
        coParentAmount: halfAmount,
        childAmounts: {}
      };
    }
    
    if (splitMethod === 'custom' && splitPercentage) {
      const userPercentage = splitPercentage[user.id] || 0;
      const coParentPercentage = splitPercentage['coParent'] || 0;
      
      return {
        userAmount: (userPercentage / 100) * amount,
        coParentAmount: (coParentPercentage / 100) * amount,
        childAmounts: {}
      };
    }
    
    if (splitMethod === 'custom' && splitAmounts) {
      return {
        userAmount: splitAmounts[user.id] || 0,
        coParentAmount: splitAmounts['coParent'] || 0,
        childAmounts: {}
      };
    }
    
    if (splitMethod === 'custom' && childSplitAmounts && Object.keys(childSplitAmounts).length > 0) {
      return {
        userAmount: 0, // When using child split, the parent split is not used
        coParentAmount: 0,
        childAmounts: childSplitAmounts
      };
    }
    
    // Default case - equal split
    const halfAmount = amount / 2;
    return {
      userAmount: halfAmount,
      coParentAmount: halfAmount,
      childAmounts: {}
    };
  }, [amount, splitMethod, splitPercentage, splitAmounts, childSplitAmounts, user]);
  
  if (!user || !splitSummary) return null;
  
  // Filter children to only include those in childIds
  const selectedChildren = children.filter(child => childIds.includes(child.id));
  
  // If no split is configured yet, don't show preview
  if (amount === 0 || (!splitSummary.userAmount && !splitSummary.coParentAmount && 
      Object.keys(splitSummary.childAmounts).length === 0)) {
    return null;
  }
  
  const hasChildSplits = Object.keys(splitSummary.childAmounts).length > 0;
  
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="pt-4">
        <h3 className="text-sm font-medium mb-2">Split Preview</h3>
        
        {!hasChildSplits ? (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>You pay:</span>
              <span className="font-medium">{formatCurrency(splitSummary.userAmount, currency.symbol)}</span>
            </div>
            <div className="flex justify-between">
              <span>Co-parent pays:</span>
              <span className="font-medium">{formatCurrency(splitSummary.coParentAmount, currency.symbol)}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-2">Expense split by child:</p>
            {selectedChildren.map(child => (
              <div key={child.id} className="flex justify-between">
                <span>{child.name || child.initials}:</span>
                <span className="font-medium">
                  {formatCurrency(splitSummary.childAmounts[child.id] || 0, currency.symbol)}
                </span>
              </div>
            ))}
          </div>
        )}
        
        <div className="pt-2 mt-2 border-t border-blue-200 flex justify-between">
          <span>Total:</span>
          <span className="font-medium">{formatCurrency(amount, currency.symbol)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SplitPreview;
