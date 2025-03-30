
import { UseFormReturn } from 'react-hook-form';
import { ExpenseCategory, SplitMethod } from '@/utils/types';
import { FormValues } from './schema';
import { DescriptionField } from './fields/DescriptionField';
import { AmountField } from './fields/AmountField';
import { DateField } from './fields/DateField';
import { CategoryField } from './fields/CategoryField';
import { SplitMethodField } from './fields/SplitMethodField';

interface ExpenseDetailsSectionProps {
  form: UseFormReturn<FormValues, any, undefined>;
  categories: ExpenseCategory[];
  splitMethods: SplitMethod[];
  onSplitMethodChange?: (method: SplitMethod) => void;
}

const ExpenseDetailsSection = ({ 
  form, 
  categories, 
  splitMethods,
  onSplitMethodChange
}: ExpenseDetailsSectionProps) => {
  return (
    <>
      <DescriptionField form={form} />
      
      <div className="grid grid-cols-2 gap-4">
        <AmountField form={form} />
        <DateField form={form} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <CategoryField form={form} categories={categories} />
        <SplitMethodField 
          form={form} 
          splitMethods={splitMethods} 
          onSplitMethodChange={onSplitMethodChange}
        />
      </div>
    </>
  );
};

export default ExpenseDetailsSection;
