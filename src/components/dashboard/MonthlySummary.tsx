
import { PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CategoryProgressBar from './cards/CategoryProgressBar';
import { useMonthlySummary } from '@/hooks/useMonthlySummary';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MonthlySummary = () => {
  const { categories, categoryByChild, children, loading } = useMonthlySummary();
  const { currency } = useCurrency();

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
            <TabsTrigger value="children">By Child</TabsTrigger>
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
                    currency={currency}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No expense data available
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="children">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin h-6 w-6 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
              </div>
            ) : children.length > 0 ? (
              <div className="space-y-6">
                {children.map((child) => (
                  <div key={child.id} className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-6 w-6 rounded-full bg-famacle-blue flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{child.initials}</span>
                      </div>
                      <h4 className="font-medium">{child.name || child.initials}</h4>
                    </div>
                    
                    {categoryByChild[child.id] && categoryByChild[child.id].length > 0 ? (
                      <div className="pl-8 space-y-3">
                        {categoryByChild[child.id].map((category) => (
                          <CategoryProgressBar 
                            key={`${child.id}-${category.name}`}
                            name={category.name}
                            amount={category.amount}
                            percentage={category.percentage}
                            color={category.color}
                            currency={currency}
                            compact
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="pl-8 text-sm text-gray-500">
                        No expenses recorded
                      </div>
                    )}
                  </div>
                ))}
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
        <Button variant="outline" className="w-full">
          <PieChart className="w-4 h-4 mr-2" />
          View Full Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MonthlySummary;
