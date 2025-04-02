
import { Expense } from "@/utils/types";
import { useState } from "react";
import { formatCurrency } from "@/utils/expenseUtils";
import ExpenseDetailDialog from "@/components/expenses/ExpenseDetailDialog";
import { useNavigate } from "react-router-dom";

interface ExpenseAttachmentProps {
  attachment: any;
  variant?: "light" | "dark";
  onExpenseClick: (expenseId: string) => void;
}

export const ExpenseAttachment = ({ 
  attachment, 
  variant = "light",
  onExpenseClick
}: ExpenseAttachmentProps) => {
  if (attachment.type !== 'expense_reference' || !attachment.expenseId) {
    return null;
  }
  
  const { expenseInfo } = attachment;
  
  // Format the expense amount
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(expenseInfo?.amount || 0);
  
  // Format the date
  const formattedDate = expenseInfo?.date ? 
    new Date(expenseInfo.date).toLocaleDateString() : 
    'Unknown date';
  
  const textColorClass = variant === "dark" ? "text-white" : "text-gray-800";
  const bgColorClass = variant === "dark" ? "bg-famacle-blue-dark/30" : "bg-gray-100";
  const hoverColorClass = variant === "dark" ? "hover:bg-famacle-blue-dark/50" : "hover:bg-gray-200";
  const linkColorClass = variant === "dark" ? "text-blue-200 hover:text-blue-100" : "text-blue-600 hover:text-blue-800";
  
  return (
    <div 
      className={`mt-2 p-3 ${bgColorClass} rounded-md cursor-pointer ${hoverColorClass} transition-colors`}
      onClick={() => onExpenseClick(attachment.expenseId)}
    >
      <div className={`font-semibold mb-1 ${textColorClass}`}>Expense Reference:</div>
      <div className={`text-sm ${textColorClass}`}>
        <div><span className="font-medium">Description:</span> {expenseInfo?.description || 'N/A'}</div>
        <div><span className="font-medium">Amount:</span> {formattedAmount}</div>
        <div><span className="font-medium">Date:</span> {formattedDate}</div>
        <div><span className="font-medium">Category:</span> {expenseInfo?.category || 'N/A'}</div>
      </div>
      <div className="mt-2">
        <span className={`${linkColorClass} text-sm font-medium`}>
          Click to view full details
        </span>
      </div>
    </div>
  );
};
