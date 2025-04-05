
import { useState, useEffect } from 'react';
import { Control, useFormContext, useWatch } from 'react-hook-form';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from "@/components/ui/slider";
import { useAuth } from '@/hooks/useAuth';
import { useChildren } from '@/hooks/children';
import { FormValues } from './schema';

interface CustomSplitFieldProps {
  control: Control<FormValues>;
  selectedChildIds: string[];
}

const CustomSplitField = ({ control, selectedChildIds }: CustomSplitFieldProps) => {
  const { user } = useAuth();
  const { data: children = [] } = useChildren();
  const { setValue, getValues } = useFormContext();
  const [activeTab, setActiveTab] = useState('percentage');
  const [percentageValue, setPercentageValue] = useState<number>(50);
  const [amountValues, setAmountValues] = useState<Record<string, number>>({});
  const [childAmounts, setChildAmounts] = useState<Record<string, number>>({});
  const amount = parseFloat(useWatch({ control, name: 'amount' }) || '0');

  // Effect to initialize or update values when dependencies change
  useEffect(() => {
    const currentSplitValues = getValues();
    
    // Initialize with any existing values or defaults
    if (activeTab === 'percentage') {
      if (currentSplitValues.splitPercentage && Object.keys(currentSplitValues.splitPercentage).length > 0) {
        if (user && currentSplitValues.splitPercentage[user.id]) {
          setPercentageValue(currentSplitValues.splitPercentage[user.id]);
        }
      } else {
        // Default: User pays 50%, other parent pays 50%
        setPercentageValue(50);
      }
      
      // Update form values
      if (user) {
        const updatedPercentages = {
          [user.id]: percentageValue,
          'coParent': 100 - percentageValue
        };
        setValue('splitPercentage', updatedPercentages);
      }
      
      // Clear the other split method values when using percentages
      setValue('splitAmounts', undefined);
      setValue('childSplitAmounts', undefined);
    } 
    else if (activeTab === 'amount') {
      let initialAmounts: Record<string, number> = {};
      
      if (currentSplitValues.splitAmounts && Object.keys(currentSplitValues.splitAmounts).length > 0) {
        initialAmounts = { ...currentSplitValues.splitAmounts };
      } else {
        // Default: Split amount equally if available
        if (user && amount > 0) {
          const halfAmount = amount / 2;
          initialAmounts[user.id] = halfAmount;
          initialAmounts['coParent'] = halfAmount;
        }
      }
      
      setAmountValues(initialAmounts);
      setValue('splitAmounts', initialAmounts);
      
      // Clear the other split method values when using fixed amounts
      setValue('splitPercentage', undefined);
      setValue('childSplitAmounts', undefined);
    }
    else if (activeTab === 'children') {
      let initialChildAmounts: Record<string, number> = {};
      
      if (currentSplitValues.childSplitAmounts && Object.keys(currentSplitValues.childSplitAmounts).length > 0) {
        initialChildAmounts = { ...currentSplitValues.childSplitAmounts };
      } else if (selectedChildIds.length > 0 && amount > 0) {
        // Default: Split amount equally among selected children
        const amountPerChild = amount / selectedChildIds.length;
        selectedChildIds.forEach(childId => {
          initialChildAmounts[childId] = amountPerChild;
        });
      }
      
      setChildAmounts(initialChildAmounts);
      setValue('childSplitAmounts', initialChildAmounts);
      
      // Clear the other split method values when using child amounts
      setValue('splitPercentage', undefined);
      setValue('splitAmounts', undefined);
    }
  }, [activeTab, user, amount, setValue, getValues, selectedChildIds]);

  // Handle percentage change from the slider
  const handlePercentageChange = (values: number[]) => {
    const newValue = values[0];
    setPercentageValue(newValue);
    
    if (user) {
      const updatedPercentages = {
        [user.id]: newValue,
        'coParent': 100 - newValue
      };
      
      // Update the form value
      setValue('splitPercentage', updatedPercentages);
      
      // Clear the other split method values when using percentages
      setValue('splitAmounts', undefined);
      setValue('childSplitAmounts', undefined);
    }
  };

  // Handle amount change
  const handleAmountChange = (key: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    
    // Update the state
    const updatedAmounts = { ...amountValues, [key]: numValue };
    setAmountValues(updatedAmounts);
    
    // Update the form value
    setValue('splitAmounts', updatedAmounts);
    
    // Clear the other split method values when using fixed amounts
    setValue('splitPercentage', undefined);
    setValue('childSplitAmounts', undefined);
  };

  // Handle child amount change
  const handleChildAmountChange = (childId: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    
    // Update the state
    const updatedChildAmounts = { ...childAmounts, [childId]: numValue };
    setChildAmounts(updatedChildAmounts);
    
    // Update the form value
    setValue('childSplitAmounts', updatedChildAmounts);
    
    // Clear the other split method values when using child amounts
    setValue('splitPercentage', undefined);
    setValue('splitAmounts', undefined);
  };

  // Filter children by selectedChildIds
  const selectedChildren = children.filter(child => 
    selectedChildIds.includes(child.id)
  );

  return (
    <div className="space-y-4">
      <FormLabel>Custom Split</FormLabel>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="percentage">Percentage</TabsTrigger>
          <TabsTrigger value="amount">Amount</TabsTrigger>
          <TabsTrigger value="children" disabled={selectedChildIds.length === 0}>Children</TabsTrigger>
        </TabsList>
        
        <TabsContent value="percentage">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between mb-2">
                  <span>You: {percentageValue}%</span>
                  <span>Co-parent: {100 - percentageValue}%</span>
                </div>
                <Slider
                  value={[percentageValue]}
                  onValueChange={handlePercentageChange}
                  max={100}
                  step={5}
                  className="mb-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="amount">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormLabel>You ($)</FormLabel>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={amountValues[user?.id || ''] || 0}
                      onChange={(e) => handleAmountChange(user?.id || '', e.target.value)}
                    />
                  </div>
                  <div>
                    <FormLabel>Co-parent ($)</FormLabel>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={amountValues['coParent'] || 0}
                      onChange={(e) => handleAmountChange('coParent', e.target.value)}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Total: ${Object.values(amountValues).reduce((sum, val) => sum + val, 0).toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="children">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {selectedChildren.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedChildren.map(child => (
                        <div key={child.id}>
                          <FormLabel>{child.name || child.initials} ($)</FormLabel>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={childAmounts[child.id] || 0}
                            onChange={(e) => handleChildAmountChange(child.id, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      Total: ${Object.values(childAmounts).reduce((sum, val) => sum + val, 0).toFixed(2)}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Please select at least one child to allocate expenses
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomSplitField;
