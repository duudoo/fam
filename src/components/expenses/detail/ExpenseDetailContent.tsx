
import { Expense } from "@/utils/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, DollarSign, Receipt, SplitSquareVertical, Tag, User } from "lucide-react";
import { formatCurrency } from "@/utils/expenseUtils";
import CategoryBadge from "@/components/expenses/CategoryBadge";
import StatusBadge from "@/components/expenses/StatusBadge";
import ExpenseStatusMenu from "@/components/expenses/ExpenseStatusMenu";
import { Currency } from "@/contexts/CurrencyContext";

interface ExpenseDetailContentProps {
  expense: Expense;
  currentUserId: string;
  currency: Currency;
  isDeleting: boolean;
  onStatusChange: () => void;
  onDelete: () => void;
}

const ExpenseDetailContent = ({ 
  expense, 
  currentUserId, 
  currency, 
  isDeleting,
  onStatusChange,
  onDelete
}: ExpenseDetailContentProps) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{expense.description}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <CategoryBadge category={expense.category} />
              <StatusBadge status={expense.status} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-famacle-slate">
              {formatCurrency(expense.amount, currency.symbol)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {format(new Date(expense.date), 'PPP')}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <Separator className="mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <DetailItem 
              icon={<Calendar className="h-5 w-5 text-gray-500" />}
              label="Date"
              value={format(new Date(expense.date), 'PPP')}
            />
            
            <DetailItem 
              icon={<Tag className="h-5 w-5 text-gray-500" />}
              label="Category"
              value={expense.category}
              capitalize
            />
            
            <DetailItem 
              icon={<User className="h-5 w-5 text-gray-500" />}
              label="Paid By"
              value={currentUserId === expense.paidBy ? "You" : "Co-parent"}
            />
            
            <DetailItem 
              icon={<Clock className="h-5 w-5 text-gray-500" />}
              label="Created"
              value={format(new Date(expense.createdAt), 'PPP')}
            />
          </div>
          
          <div className="space-y-4">
            <DetailItem 
              icon={<DollarSign className="h-5 w-5 text-gray-500" />}
              label="Amount"
              value={formatCurrency(expense.amount, currency.symbol)}
            />
            
            <DetailItem 
              icon={<SplitSquareVertical className="h-5 w-5 text-gray-500" />}
              label="Split Method"
              value={expense.splitMethod}
              capitalize
            />
            
            {expense.receiptUrl && (
              <DetailItem 
                icon={<Receipt className="h-5 w-5 text-gray-500" />}
                label="Receipt"
                isLink
                url={expense.receiptUrl}
                linkText="View Receipt"
              />
            )}
            
            {currentUserId === expense.paidBy && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Update Status</p>
                <ExpenseStatusMenu 
                  expenseId={expense.id}
                  currentStatus={expense.status}
                  isProcessing={isDeleting}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              </div>
            )}
          </div>
        </div>
        
        {expense.notes && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Notes</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{expense.notes}</p>
          </div>
        )}
        
        {expense.disputeNotes && (
          <div className="mt-6 p-4 bg-red-50 rounded-md border border-red-100">
            <h3 className="text-lg font-medium text-red-600 mb-2">Dispute Notes</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{expense.disputeNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
  isLink?: boolean;
  url?: string;
  linkText?: string;
}

const DetailItem = ({ icon, label, value, capitalize, isLink, url, linkText }: DetailItemProps) => {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {isLink && url ? (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-famacle-blue hover:underline"
          >
            {linkText || url}
          </a>
        ) : (
          <p className={capitalize ? "capitalize" : ""}>{value}</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseDetailContent;
