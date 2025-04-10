
import { useState } from 'react';
import { useExpenseFormContext } from './ExpenseFormContext';
import ExpenseDetailsSection from './ExpenseDetailsSection';
import ReceiptUploadSection from './ReceiptUploadSection';
import NotesSection from './NotesSection';
import FormActions from './FormActions';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './schema';
import { SplitMethod } from '@/utils/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface ExpenseFormContentProps {
  form: UseFormReturn<FormValues, any, undefined>;
}

const ExpenseFormContent = ({ form }: ExpenseFormContentProps) => {
  const { 
    expense, 
    setReceiptUrl, 
    onCancel,
    isSubmitting,
    isEditing
  } = useExpenseFormContext();
  
  const isMobile = useIsMobile();
  
  const [showCustomSplit, setShowCustomSplit] = useState(
    form.getValues().splitMethod === 'custom'
  );
  
  const handleSplitMethodChange = (method: SplitMethod) => {
    console.log(`Split method changed to: ${method}, showing custom field: ${method === 'custom'}`);
    setShowCustomSplit(method === 'custom');
  };

  return (
    <>
      <ExpenseDetailsSection control={form.control} />
      
      <ReceiptUploadSection 
        onFileUpload={setReceiptUrl}
        existingReceiptUrl={expense?.receiptUrl}
      />
      
      <FormActions 
        onCancel={onCancel} 
        isSubmitting={isSubmitting} 
        isEditing={isEditing}
        showSaveAndShare={!isEditing}
        showSaveAndAddAnother={!isEditing}
        isMobile={isMobile}
      />
    </>
  );
};

export default ExpenseFormContent;
