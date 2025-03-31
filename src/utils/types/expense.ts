
/**
 * Expense-related types for the Famacle application
 */

/**
 * Categories for expenses
 */
export type ExpenseCategory = 
  | 'medical'
  | 'education'
  | 'clothing'
  | 'activities'
  | 'food'
  | string; // Allow custom categories

/**
 * Status of an expense
 */
export type ExpenseStatus = 
  | 'pending'
  | 'approved'
  | 'disputed'
  | 'paid';

/**
 * Methods for splitting expenses between co-parents
 */
export type SplitMethod = 
  | '50/50'
  | 'custom'
  | 'none';

/**
 * Expense record
 */
export type Expense = {
  /** Unique identifier */
  id: string;
  /** Short description of the expense */
  description: string;
  /** Monetary amount of the expense */
  amount: number;
  /** Date of the expense in ISO format (YYYY-MM-DD) */
  date: string;
  /** Category of the expense */
  category: ExpenseCategory;
  /** ID of the parent who paid for the expense */
  paidBy: string;
  /** Optional URL to a receipt image */
  receiptUrl?: string;
  /** Current status of the expense */
  status: ExpenseStatus;
  /** Method used to split the expense between co-parents */
  splitMethod: SplitMethod;
  /** For custom splits, percentage allocation by parent ID */
  splitPercentage?: Record<string, number>;
  /** For exact split amounts, monetary allocation by parent ID */
  splitAmounts?: Record<string, number>;
  /** Optional notes about the expense */
  notes?: string;
  /** Additional notes for disputes */
  disputeNotes?: string;
  /** Audit trail of status changes */
  statusHistory?: {
    status: ExpenseStatus;
    timestamp: string;
    userId: string;
    note?: string;
  }[];
  /** IDs of children associated with this expense */
  childIds?: string[];
  /** ISO timestamp when the expense was created */
  createdAt: string;
  /** ISO timestamp when the expense was last updated */
  updatedAt: string;
};
