
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Expense, ExpenseStatus } from '@/utils/types';
import ExpenseCard from '@/components/expenses/ExpenseCard';

const ExpensesSection = () => {
  const [expenseTab, setExpenseTab] = useState('pending');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchExpenses();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('dashboard-expenses-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'expenses',
          },
          () => {
            fetchExpenses();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);
  
  const fetchExpenses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
        
      if (error) throw error;
      
      if (data) {
        setExpenses(data.map(expense => ({
          id: expense.id,
          description: expense.description,
          amount: parseFloat(expense.amount),
          date: expense.date,
          category: expense.category,
          paidBy: expense.paid_by,
          receiptUrl: expense.receipt_url || undefined,
          status: expense.status as ExpenseStatus,
          splitMethod: expense.split_method,
          notes: expense.notes || undefined,
          createdAt: expense.created_at,
          updatedAt: expense.updated_at
        })));
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };
  
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
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin h-6 w-6 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              <TabsContent value="pending" className="space-y-4">
                {expenses.filter(e => e.status === 'pending').length > 0 ? (
                  expenses.filter(e => e.status === 'pending').map(expense => (
                    <ExpenseCard key={expense.id} expense={expense} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No pending expenses found
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="approved" className="space-y-4">
                {expenses.filter(e => e.status === 'approved').length > 0 ? (
                  expenses.filter(e => e.status === 'approved').map(expense => (
                    <ExpenseCard key={expense.id} expense={expense} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No approved expenses found
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recent" className="space-y-4">
                {expenses.length > 0 ? (
                  expenses
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 3)
                    .map(expense => (
                      <ExpenseCard key={expense.id} expense={expense} />
                    ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No recent expenses found
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button asChild variant="outline" className="w-full">
          <Link to="/expenses">
            <Plus className="w-4 h-4 mr-2" />
            New Expense
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpensesSection;
