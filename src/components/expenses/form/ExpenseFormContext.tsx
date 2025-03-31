
import { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { Expense, ExpenseCategory, SplitMethod } from '@/utils/types';

// Define available categories and split methods
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
  'custom'
];

interface ExpenseFormContextType {
  expense?: Expense;
  onExpenseAdded?: () => void;
  onCancel?: () => void;
  categories: ExpenseCategory[];
  splitMethods: SplitMethod[];
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  receiptUrl: string;
  setReceiptUrl: Dispatch<SetStateAction<string>>;
  isEditing: boolean;
}

const ExpenseFormContext = createContext<ExpenseFormContextType | undefined>(undefined);

export const useExpenseFormContext = () => {
  const context = useContext(ExpenseFormContext);
  if (!context) {
    throw new Error('useExpenseFormContext must be used within a ExpenseFormProvider');
  }
  return context;
};

interface ExpenseFormProviderProps {
  children: ReactNode;
  expense?: Expense;
  onExpenseAdded?: () => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  receiptUrl: string;
  setReceiptUrl: Dispatch<SetStateAction<string>>;
}

export const ExpenseFormProvider = ({
  children,
  expense,
  onExpenseAdded,
  onCancel,
  isSubmitting,
  setIsSubmitting,
  receiptUrl,
  setReceiptUrl
}: ExpenseFormProviderProps) => {
  const isEditing = !!expense;

  return (
    <ExpenseFormContext.Provider value={{
      expense,
      onExpenseAdded,
      onCancel,
      categories,
      splitMethods,
      isSubmitting,
      setIsSubmitting,
      receiptUrl,
      setReceiptUrl,
      isEditing
    }}>
      {children}
    </ExpenseFormContext.Provider>
  );
};
