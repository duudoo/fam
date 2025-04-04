
import { PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CategoryProgressBar from './cards/CategoryProgressBar';
import { useMonthlySummary } from '@/hooks/useMonthlySummary';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

const MonthlySummary = () => {
  const { categories, categoryByChild, children, loading, expensesByChild } = useMonthlySummary();
  const { currency } = useCurrency();

  // Calculate total expenses
  const totalExpenses = Object.values(expensesByChild).reduce((total, amount) => total + amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Monthly Summary</CardTitle>
        <CardDescription>Expense breakdown by category and child</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="childExpenses">By Child</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin h-6 w-6 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
              </div>
            ) : categories.length > 0 ? (
              <div className="space-y-4">
                {categories.map((category) => (
                  <CategoryProgressBar 
                    key={category.name}
                    name={category.name}
                    amount={category.amount}
                    percentage={category.percentage}
                    color={category.color}
                    currency={currency.symbol}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No expense data available
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="childExpenses">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin h-6 w-6 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
              </div>
            ) : children.length > 0 ? (
              <div className="space-y-4">
                {children.map((child) => {
                  const childAmount = expensesByChild[child.id] || 0;
                  const percentage = totalExpenses > 0 ? (childAmount / totalExpenses) * 100 : 0;
                  
                  return (
                    <div key={child.id} className="space-y-1">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-famacle-blue flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{child.initials}</span>
                          </div>
                          <span className="font-medium">{child.name || child.initials}</span>
                        </div>
                        <div className="text-sm font-medium">
                          {currency.symbol}{childAmount.toFixed(2)} ({percentage.toFixed(1)}%)
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className="bg-famacle-blue h-2.5 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Expenses</span>
                    <span className="font-semibold">{currency.symbol}{totalExpenses.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No children added yet
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/expenses">
            <PieChart className="w-4 h-4 mr-2" />
            View Full Report
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MonthlySummary;
