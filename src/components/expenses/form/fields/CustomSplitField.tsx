
import { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../schema';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

interface CustomSplitFieldProps {
  form: UseFormReturn<FormValues, any, undefined>;
  visible: boolean;
}

const CustomSplitField = ({ form, visible }: CustomSplitFieldProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [parentAPercentage, setParentAPercentage] = useState(50);
  
  // Update the form with split percentages when slider changes
  useEffect(() => {
    if (visible && user) {
      const splitPercentage = {
        [user.id]: parentAPercentage,
        coParent: 100 - parentAPercentage
      };
      
      form.setValue('splitPercentage', splitPercentage);
      
      // Log for debugging
      console.log('Updated split percentages:', splitPercentage);
    }
  }, [parentAPercentage, user, visible, form]);
  
  // Initialize from existing values if available
  useEffect(() => {
    if (visible && user) {
      const currentSplitPercentage = form.getValues().splitPercentage;
      if (currentSplitPercentage && currentSplitPercentage[user.id]) {
        setParentAPercentage(currentSplitPercentage[user.id]);
      }
    }
  }, [visible, user, form]);
  
  if (!visible) return null;
  
  return (
    <div className={`space-y-4 mt-4 p-4 border rounded-md bg-gray-50 ${isMobile ? 'mx-0' : ''}`}>
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
        className={isMobile ? 'touch-manipulation' : ''}
      />
    </div>
  );
};

export default CustomSplitField;
