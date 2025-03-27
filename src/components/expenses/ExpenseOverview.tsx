
import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/utils/types";

interface ExpenseOverviewProps {
  expenses: Expense[];
}

const ExpenseOverview = ({ expenses }: ExpenseOverviewProps) => {
  // Calculate totals
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter(exp => exp.status === 'pending');
  
  // Get current month expenses
  const currentMonthExpenses = expenses.filter(exp => {
    const expMonth = new Date(exp.date).getMonth();
    const expYear = new Date(exp.date).getFullYear();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return expMonth === currentMonth && expYear === currentYear;
  });

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-famacle-blue" />
          Expense Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-famacle-blue-light/30 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-famacle-slate">
              ${totalExpenses.toFixed(2)}
            </p>
          </div>
          
          <div className="p-4 bg-famacle-teal-light/30 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
            <p className="text-2xl font-bold text-famacle-slate">
              ${pendingExpenses
                .reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </p>
          </div>
          
          <div className="p-4 bg-famacle-coral-light/30 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-2xl font-bold text-famacle-slate">
              ${currentMonthExpenses
                .reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseOverview;
