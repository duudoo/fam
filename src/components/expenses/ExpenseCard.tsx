
import { useState } from "react";
import { Expense } from "@/utils/types";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, FileText, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/expenses/StatusBadge";
import CategoryBadge from "@/components/expenses/CategoryBadge";
import ExpenseStatusMenu from "@/components/expenses/ExpenseStatusMenu";
import ExpenseCardHeader from "./ExpenseCardHeader";
import ExpenseCardDetails from "./ExpenseCardDetails";
import ExpenseCardActions from "./ExpenseCardActions";
import ExpenseForm from "./form/ExpenseForm";
import { useChildren } from "@/hooks/children";

interface ExpenseCardProps {
  expense: Expense;
  showActions?: boolean;
  className?: string;
}

const ExpenseCard = ({ expense, showActions = true, className }: ExpenseCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: children = [] } = useChildren();

  if (isEditing) {
    return (
      <ExpenseForm 
        expense={expense}
        onExpenseAdded={() => setIsEditing(false)} 
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
  };
  
  // Filter children that are related to this expense
  const relatedChildren = children.filter(child => 
    expense.childIds?.includes(child.id)
  );

  return (
    <Card 
      className={cn(
        "shadow-sm hover:shadow-md transition-shadow duration-200",
        (isDeleting || isUpdating) && "opacity-60 pointer-events-none",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-lg text-famacle-slate">{expense.description}</h3>
          <div className="flex items-center gap-2">
            <StatusBadge status={expense.status} />
            
            <ExpenseStatusMenu 
              expenseId={expense.id}
              currentStatus={expense.status}
              isProcessing={isDeleting || isUpdating}
              onStatusChange={() => setIsUpdating(true)}
              onDelete={handleDelete}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium text-famacle-slate">${expense.amount.toFixed(2)}</span>
          </div>
          
          <CategoryBadge category={expense.category} />
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-1 col-span-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span>Split: {expense.splitMethod}</span>
          </div>
          
          {relatedChildren.length > 0 && (
            <div className="flex items-center gap-1 col-span-2 mt-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span>
                For: {relatedChildren.map(c => c.name || c.initials).join(', ')}
              </span>
            </div>
          )}
        </div>
        
        {expense.notes && (
          <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-2 rounded-md">
            {expense.notes}
          </div>
        )}
        
        {showActions && (
          <ExpenseCardActions 
            expense={expense} 
            onEdit={() => setIsEditing(true)} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
