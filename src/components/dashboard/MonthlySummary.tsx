
import { PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const MonthlySummary = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Monthly Summary</CardTitle>
        <CardDescription>Expense breakdown by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <CategoryProgressBar 
            name="Education"
            amount={150}
            percentage={30}
            color="bg-famacle-blue"
          />
          
          <CategoryProgressBar 
            name="Medical"
            amount={250}
            percentage={50}
            color="bg-famacle-teal"
          />
          
          <CategoryProgressBar 
            name="Activities"
            amount={100}
            percentage={20}
            color="bg-famacle-coral"
          />
        </div>
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

interface CategoryProgressBarProps {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

const CategoryProgressBar = ({ name, amount, percentage, color }: CategoryProgressBarProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
        <span className="text-sm font-medium">{name}</span>
      </div>
      <span className="text-sm font-medium">${amount.toFixed(2)}</span>
    </div>
    <Progress value={percentage} className="h-2 bg-gray-100" />
  </div>
);

export default MonthlySummary;
