
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockExpenses } from '@/utils/mockData';
import ExpenseCard from '../ExpenseCard';

const ExpensesSection = () => {
  const [expenseTab, setExpenseTab] = useState('pending');
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Recent Expenses</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/expenses" className="flex items-center text-famacle-blue">
              View All 
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" onValueChange={setExpenseTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="space-y-4">
            {mockExpenses.filter(e => e.status === 'pending').map(expense => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </TabsContent>
          <TabsContent value="approved" className="space-y-4">
            {mockExpenses.filter(e => e.status === 'approved').map(expense => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </TabsContent>
          <TabsContent value="recent" className="space-y-4">
            {mockExpenses
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 3)
              .map(expense => (
                <ExpenseCard key={expense.id} expense={expense} />
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button asChild variant="outline" className="w-full">
          <Link to="/expenses/new">
            <Plus className="w-4 h-4 mr-2" />
            New Expense
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpensesSection;
