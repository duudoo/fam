
import { createContext, useContext, useState } from 'react';
import { Expense, ExpenseCategory, SplitMethod } from '@/utils/types';

interface ExpenseFormContextProps {
  isEditing: boolean;
  isSubmitting: boolean;
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
  onExpenseAdded?: () => void;
  onCancel?: () => void;
}

export const ExpenseFormProvider = ({ children, expense, onExpenseAdded, onCancel }: ExpenseFormProviderProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string>(expense?.receiptUrl || '');
  const isEditing = !!expense;
  
  const categories: ExpenseCategory[] = [
    'medical',
    'education',
    'clothing',
    'activities',
    'food',
    'other'
  ];
  
  const splitMethods: SplitMethod[] = [
    'none',
    '50/50',
    'income-based',
    'custom'
  ];

  return (
    <ExpenseFormContext.Provider value={{
      isEditing,
      isSubmitting,
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
