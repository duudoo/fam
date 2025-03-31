
import { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../schema';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormDescription } from '@/components/ui/form';

interface CustomSplitFieldProps {
  form: UseFormReturn<FormValues, any, undefined>;
  visible: boolean;
}

const CustomSplitField = ({ form, visible }: CustomSplitFieldProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [parentAPercentage, setParentAPercentage] = useState(50);
  const [splitType, setSplitType] = useState<'percentage' | 'amount'>('percentage');
  const [yourAmount, setYourAmount] = useState('');
  const [coParentAmount, setCoParentAmount] = useState('');
  
  const totalAmount = parseFloat(form.getValues().amount) || 0;
  
  // Calculate co-parent amount when your amount changes
  useEffect(() => {
    if (splitType === 'amount' && yourAmount !== '') {
      const yourAmountNum = parseFloat(yourAmount) || 0;
      const coParentAmountNum = Math.max(0, totalAmount - yourAmountNum);
      setCoParentAmount(coParentAmountNum.toFixed(2));
    }
  }, [yourAmount, totalAmount, splitType]);
  
  // Update the form with split percentages when slider changes
  useEffect(() => {
    if (visible && user) {
      if (splitType === 'percentage') {
        const splitPercentage = {
          [user.id]: parentAPercentage,
          coParent: 100 - parentAPercentage
        };
        
        form.setValue('splitPercentage', splitPercentage);
        form.setValue('splitAmounts', undefined);
        
        // Log for debugging
        console.log('Updated split percentages:', splitPercentage);
      } else if (splitType === 'amount') {
        const yourAmountNum = parseFloat(yourAmount) || 0;
        const coParentAmountNum = parseFloat(coParentAmount) || 0;
        
        const splitAmounts = {
          [user.id]: yourAmountNum,
          coParent: coParentAmountNum
        };
        
        form.setValue('splitAmounts', splitAmounts);
        form.setValue('splitPercentage', undefined);
        
        // Log for debugging
        console.log('Updated split amounts:', splitAmounts);
      }
    }
  }, [parentAPercentage, yourAmount, coParentAmount, user, visible, form, splitType]);
  
  // Initialize from existing values if available
  useEffect(() => {
    if (visible && user) {
      const currentSplitPercentage = form.getValues().splitPercentage;
      const currentSplitAmounts = form.getValues().splitAmounts;
      
      if (currentSplitAmounts && currentSplitAmounts[user.id]) {
        setSplitType('amount');
        setYourAmount(currentSplitAmounts[user.id].toString());
        if (currentSplitAmounts.coParent) {
          setCoParentAmount(currentSplitAmounts.coParent.toString());
        }
      } else if (currentSplitPercentage && currentSplitPercentage[user.id]) {
        setSplitType('percentage');
        setParentAPercentage(currentSplitPercentage[user.id]);
      }
    }
  }, [visible, user, form]);
  
  if (!visible) return null;
  
  return (
    <div className={`space-y-4 mt-4 p-4 border rounded-md bg-gray-50 ${isMobile ? 'mx-0' : ''}`}>
      <RadioGroup 
        value={splitType} 
        onValueChange={(value) => setSplitType(value as 'percentage' | 'amount')}
        className="flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="percentage" id="percentage" />
          <Label htmlFor="percentage">By Percentage</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="amount" id="amount" />
          <Label htmlFor="amount">By Amount</Label>
        </div>
      </RadioGroup>
      
      {splitType === 'percentage' ? (
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="font-medium">You</span>
              <span className="ml-2 text-gray-500">{parentAPercentage}%</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Co-Parent</span>
              <span className="ml-2 text-gray-500">{100 - parentAPercentage}%</span>
            </div>
          </div>
          
          <Slider
            defaultValue={[parentAPercentage]}
            value={[parentAPercentage]}
            min={0}
            max={100}
            step={5}
            onValueChange={(value) => setParentAPercentage(value[0])}
            className={`mt-2 ${isMobile ? 'touch-manipulation' : ''}`}
          />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="yourAmount">Your Amount</Label>
            <Input
              id="yourAmount"
              type="number"
              value={yourAmount}
              onChange={(e) => setYourAmount(e.target.value)}
              className="mt-1"
              placeholder="0.00"
              min="0"
              max={totalAmount.toString()}
              step="0.01"
            />
          </div>
          
          <div>
            <Label htmlFor="coParentAmount">Co-Parent Amount</Label>
            <Input
              id="coParentAmount"
              type="number"
              value={coParentAmount}
              readOnly
              className="mt-1 bg-gray-100"
            />
            <FormDescription className="text-xs mt-1">
              This is automatically calculated based on the total amount ({totalAmount.toFixed(2)})
            </FormDescription>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSplitField;
