
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/expenseUtils";
import { useNavigate } from "react-router-dom";
import { Expense } from "@/utils/types";
import { CheckCircle2, Clock, Edit3, Eye, MoreHorizontal, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import ExpenseCard from "../expenses/ExpenseCard";
import { useIsMobile } from "@/hooks/use-mobile";

const MAX_EXPENSES = 3;

interface ExpensesSectionProps {
  expenses: Expense[];
  isLoading: boolean;
}

export const ExpensesSection = ({ expenses, isLoading }: ExpensesSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { currency } = useCurrency();
  const [displayedExpenses, setDisplayedExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (expenses && expenses.length > 0) {
      // Sort expenses by date (newest first) and take the first MAX_EXPENSES
      const sorted = [...expenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, MAX_EXPENSES);
      
      setDisplayedExpenses(sorted);
    } else {
      setDisplayedExpenses([]);
    }
  }, [expenses]);

  const handleViewAllExpenses = () => {
    navigate("/expenses");
  };

  const handleAddExpense = () => {
    navigate("/expenses?newExpense=true");
  };

  const handleViewExpense = (id: string) => {
    // Updated to use the correct route for viewing expense details
    navigate(`/expense/${id}`);
  };

  const handleEditExpense = (id: string) => {
    // We don't have a dedicated edit route in App.tsx, so we'll navigate to the expense page
    // Users can edit from there
    navigate(`/expense/${id}`);
  };

  if (isLoading) {
    return (
      <Card className="col-span-full md:col-span-2 min-h-60">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "disputed":
        return <Edit3 className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="col-span-full md:col-span-2 min-h-60">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Expenses</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewAllExpenses}
          >
            View All
          </Button>
          <Button
            size="sm"
            onClick={handleAddExpense}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {displayedExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="mb-4 text-gray-500">No expenses found</p>
            <Button onClick={handleAddExpense} variant="default">
              <Plus className="h-4 w-4 mr-2" /> Add Your First Expense
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {isMobile ? (
              // Mobile view with cards
              displayedExpenses.map((expense) => (
                <div 
                  key={expense.id} 
                  className="p-4 border rounded-lg bg-white shadow-sm cursor-pointer hover:border-primary"
                  onClick={() => handleViewExpense(expense.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium truncate pr-2">{expense.description}</div>
                    <div className="flex items-center">
                      {getStatusIcon(expense.status)}
                      <span className="ml-1 text-xs">{expense.status}</span>
                    </div>
                  </div>
                  
                  <div className="text-lg font-semibold mb-2">
                    {formatCurrency(expense.amount, currency.symbol)}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div>{new Date(expense.date).toLocaleDateString()}</div>
                    <div className="capitalize">{expense.category}</div>
                  </div>
                </div>
              ))
            ) : (
              // Desktop view with table
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-3 font-medium text-gray-500 text-sm">Description</th>
                      <th className="text-left pb-3 font-medium text-gray-500 text-sm">Date</th>
                      <th className="text-left pb-3 font-medium text-gray-500 text-sm">Amount</th>
                      <th className="text-left pb-3 font-medium text-gray-500 text-sm">Status</th>
                      <th className="text-right pb-3 font-medium text-gray-500 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedExpenses.map((expense) => (
                      <tr key={expense.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3">{expense.description}</td>
                        <td className="py-3">{new Date(expense.date).toLocaleDateString()}</td>
                        <td className="py-3 font-medium">{formatCurrency(expense.amount, currency.symbol)}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            {getStatusIcon(expense.status)}
                            <span className="ml-2 first-letter:uppercase">{expense.status}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewExpense(expense.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditExpense(expense.id)}>
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpensesSection;
