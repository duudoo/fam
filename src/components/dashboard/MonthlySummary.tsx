
import { PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CategoryProgressBar from './cards/CategoryProgressBar';
import { useMonthlySummary } from '@/hooks/useMonthlySummary';
import { useCurrency } from '@/contexts/CurrencyContext';

const MonthlySummary = () => {
  const { categories, loading } = useMonthlySummary();
  const { currency } = useCurrency();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Monthly Summary</CardTitle>
        <CardDescription>Expense breakdown by category</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin h-6 w-6 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
          </div>
        ) : (
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
        )}
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
