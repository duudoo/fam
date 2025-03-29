
import { Card, CardContent } from '@/components/ui/card';
import { Expense, ExpenseCategory } from '@/utils/types';
import { formatCurrency } from '@/utils/expenseUtils';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface ExpenseOverviewProps {
  expenses: Expense[] | undefined;
}

const ExpenseOverview = ({ expenses = [] }: ExpenseOverviewProps) => {
  // Safely handle undefined expenses by providing a default empty array
  const totalExpenses = expenses ? expenses.reduce((sum, expense) => sum + expense.amount, 0) : 0;
  
  // Calculate expenses by category
  const expensesByCategory: Record<string, number> = {};
  if (expenses && expenses.length > 0) {
    expenses.forEach((expense) => {
      const { category } = expense;
      expensesByCategory[category] = (expensesByCategory[category] || 0) + expense.amount;
    });
  }
  
  // Prepare data for chart
  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
  }));

  return (
    <Card className="w-full mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium mb-3">Expense Summary</h3>
            <p className="text-3xl font-bold mb-1">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-sm text-gray-500">
              {expenses?.length || 0} total expenses
            </p>
            
            <div className="mt-4 space-y-3">
              {chartData.map(({ category, amount }) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{category}</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getCategoryColorClass(category as ExpenseCategory)}`}
                      style={{ width: `${(amount / totalExpenses) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2 h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                    labelFormatter={(label) => label.charAt(0).toUpperCase() + label.slice(1)}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#9b87f5"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No expense data to display
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get tailwind class for category
const getCategoryColorClass = (category: ExpenseCategory): string => {
  const categoryColors: Record<ExpenseCategory, string> = {
    medical: 'bg-red-500',
    education: 'bg-blue-500',
    clothing: 'bg-purple-500',
    activities: 'bg-green-500',
    food: 'bg-orange-500',
    other: 'bg-gray-500',
  };
  
  return categoryColors[category] || 'bg-gray-500';
};

export default ExpenseOverview;
