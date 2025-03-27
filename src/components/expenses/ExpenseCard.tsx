
import { useState } from "react";
import { Expense } from "@/utils/types";
import { Card, CardContent } from "@/components/ui/card";
import ExpenseCardHeader from "./ExpenseCardHeader";
import ExpenseCardDetails from "./ExpenseCardDetails";
import ExpenseCardActions from "./ExpenseCardActions";
import ExpenseForm from "./form/ExpenseForm";

interface ExpenseCardProps {
  expense: Expense;
  showActions?: boolean;
}

const ExpenseCard = ({ expense, showActions = true }: ExpenseCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <ExpenseForm 
        onExpenseAdded={() => setIsEditing(false)} 
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <ExpenseCardHeader expense={expense} />
        <ExpenseCardDetails expense={expense} />
        {showActions && <ExpenseCardActions expense={expense} onEdit={() => setIsEditing(true)} />}
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
