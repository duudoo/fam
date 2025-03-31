
import { createContext, useContext, useState, useEffect } from 'react';
import { Expense, ExpenseCategory, SplitMethod } from '@/utils/types';
import { useExpenseCategories } from '@/hooks/useExpenseCategories';

interface ExpenseFormContextProps {
  isEditing: boolean;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  receiptUrl: string;
  setReceiptUrl: (url: string) => void;
  categories: ExpenseCategory[];
  splitMethods: SplitMethod[];
  expense?: Expense;
  onExpenseAdded?: () => void;
  onCancel?: () => void;
}

export const ExpenseFormContext = createContext<ExpenseFormContextProps | undefined>(undefined);

export const useExpenseFormContext = () => {
  const context = useContext(ExpenseFormContext);
  if (!context) {
    throw new Error('useExpenseFormContext must be used within an ExpenseFormProvider');
  }
  return context;
};

interface ExpenseFormProviderProps {
  children: React.ReactNode;
  expense?: Expense;
  isSubmitting?: boolean;
  setIsSubmitting?: (value: boolean) => void;
  receiptUrl?: string;
  setReceiptUrl?: (url: string) => void;
  onExpenseAdded?: () => void;
  onCancel?: () => void;
}

export const ExpenseFormProvider = ({ 
  children, 
  expense,
  isSubmitting: externalIsSubmitting,
  setIsSubmitting: externalSetIsSubmitting,
  receiptUrl: externalReceiptUrl,
  setReceiptUrl: externalSetReceiptUrl, 
  onExpenseAdded, 
  onCancel 
}: ExpenseFormProviderProps) => {
  // Use external state if provided, otherwise create local state
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [localReceiptUrl, setLocalReceiptUrl] = useState<string>(expense?.receiptUrl || '');
  
  const isSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : localIsSubmitting;
  const setIsSubmitting = externalSetIsSubmitting || setLocalIsSubmitting;
  const receiptUrl = externalReceiptUrl !== undefined ? externalReceiptUrl : localReceiptUrl;
  const setReceiptUrl = externalSetReceiptUrl || setLocalReceiptUrl;
  
  const isEditing = !!expense;
  
  // Get user-defined categories
  const { categories: userCategories, isLoading: categoriesLoading } = useExpenseCategories();
  
  // Default categories as fallback
  const defaultCategories: ExpenseCategory[] = [
    'medical',
    'education',
    'clothing',
    'activities',
    'food',
    'other'
  ];
  
  // Combine user categories with defaults (removing duplicates)
  const allCategories = [...new Set([...userCategories, ...defaultCategories])];
  
  // Ensure all categories are valid ExpenseCategory types
  const categories: ExpenseCategory[] = allCategories.filter(
    (category): category is ExpenseCategory => 
      typeof category === 'string'
  ) as ExpenseCategory[];
  
  const splitMethods: SplitMethod[] = [
    '50/50',
    'custom'
  ];

  return (
    <ExpenseFormContext.Provider value={{
      isEditing,
      isSubmitting,
      setIsSubmitting,
      receiptUrl,
      setReceiptUrl,
      categories,
      splitMethods,
      expense,
      onExpenseAdded,
      onCancel
    }}>
      {children}
    </ExpenseFormContext.Provider>
  );
};
