
import { useState, useEffect } from 'react';
import { useChildren } from '@/hooks/children';
import { Check } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/utils/expenseUtils';

interface ChildrenSelectionSectionProps {
  defaultSelectedIds?: string[];
}

const ChildrenSelectionSection = ({ defaultSelectedIds = [] }: ChildrenSelectionSectionProps) => {
  const { data: children = [], isLoading } = useChildren();
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelectedIds);
  const form = useFormContext();
  const { currency } = useCurrency();
  
  // Get total expense amount
  const totalAmount = parseFloat(form.getValues()?.amount) || 0;
  
  // Calculate per-child amount (equal split)
  const perChildAmount = selectedIds.length > 0 
    ? totalAmount / selectedIds.length
    : 0;
    
  // Effect to update form value when selectedIds changes
  useEffect(() => {
    // Update the childIds in the form
    form.setValue('childIds', selectedIds);
    
    // If using custom split with per-child amounts, reset that when children change
    const splitMethod = form.getValues()?.splitMethod;
    if (splitMethod === 'custom') {
      // Clear any existing child split amounts when children selection changes
      form.setValue('childSplitAmounts', undefined);
    }
  }, [selectedIds, form]);
  
  // Effect to auto-select all children if no defaults were provided
  useEffect(() => {
    // Only auto-select if there are children available and no selections have been made yet
    if (children.length > 0 && selectedIds.length === 0 && defaultSelectedIds.length === 0) {
      // Select all children by default
      const allChildIds = children.map(child => child.id);
      setSelectedIds(allChildIds);
    }
  }, [children, selectedIds, defaultSelectedIds]);
  
  const toggleChild = (childId: string) => {
    setSelectedIds(prev => 
      prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  };
  
  if (isLoading) {
    return <div className="my-4 animate-pulse h-12 bg-gray-100 rounded-md"></div>;
  }
  
  if (children.length === 0) {
    return (
      <FormField
        control={form.control}
        name="childIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Related Children</FormLabel>
            <div className="text-sm text-gray-500 py-2 border border-dashed border-gray-300 rounded-md p-4 text-center">
              No children added yet. You can add children in the <a href="/user-management" className="text-primary hover:underline">Circle</a> page.
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  
  return (
    <FormField
      control={form.control}
      name="childIds"
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>Related Children</FormLabel>
            {selectedIds.length > 0 && totalAmount > 0 && (
              <span className="text-sm text-gray-500">
                {formatCurrency(perChildAmount, currency.symbol)} per child
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {children.map(child => (
              <Button
                key={child.id}
                type="button"
                variant="outline"
                className={cn(
                  "flex items-center justify-between border h-10 px-4 py-2 rounded-md transition-colors",
                  selectedIds.includes(child.id)
                    ? "bg-primary/10 border-primary"
                    : "bg-background hover:bg-primary/5"
                )}
                onClick={() => toggleChild(child.id)}
              >
                <span className="mr-2 font-medium">{child.name || child.initials}</span>
                {selectedIds.includes(child.id) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </Button>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ChildrenSelectionSection;
