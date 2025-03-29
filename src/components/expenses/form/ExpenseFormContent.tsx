
import { useExpenseFormContext } from './ExpenseFormContext';
import ExpenseDetailsSection from './ExpenseDetailsSection';
import ChildrenSelectionSection from './ChildrenSelectionSection';
import ReceiptUploadSection from './ReceiptUploadSection';
import NotesSection from './NotesSection';
import FormActions from './FormActions';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './ExpenseDetailsSection';

interface ExpenseFormContentProps {
  form: UseFormReturn<FormValues, any, undefined>;
}

const ExpenseFormContent = ({ form }: ExpenseFormContentProps) => {
  const { 
    categories, 
    splitMethods, 
    expense, 
    setReceiptUrl, 
    onCancel,
    isSubmitting,
    isEditing
  } = useExpenseFormContext();

  return (
    <>
      <ExpenseDetailsSection 
        form={form} 
        categories={categories} 
        splitMethods={splitMethods} 
      />
      
      <ChildrenSelectionSection 
        defaultSelectedIds={expense?.childIds}
      />
      
      <ReceiptUploadSection 
        onFileUpload={setReceiptUrl}
        existingReceiptUrl={expense?.receiptUrl}
      />
      
      <NotesSection form={form} />
      
      <FormActions 
        onCancel={onCancel} 
        isSubmitting={isSubmitting} 
        isEditing={isEditing}
      />
    </>
  );
};

export default ExpenseFormContent;
