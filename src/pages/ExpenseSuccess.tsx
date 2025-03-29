import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const ExpenseSuccess = () => {
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');
  const expenseId = searchParams.get('id');
  const [expense, setExpense] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const actionText = action === 'approve' ? 'Approved' : action === 'clarify' ? 'Requested Clarification' : action;
  
  useEffect(() => {
    const fetchExpenseDetails = async () => {
      if (!expenseId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('expenses')
          .select(`
            id, 
            description, 
            amount, 
            date, 
            category, 
            status, 
            split_method,
            split_amounts
          `)
          .eq('id', expenseId)
          .single();
          
        if (error) throw error;
        setExpense(data);
      } catch (error) {
        console.error('Error fetching expense details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpenseDetails();
  }, [expenseId]);

  const getPaymentAmount = () => {
    if (!expense) return 0;
    
    if (expense.split_amounts) {
      return Object.values(expense.split_amounts)[0] || 0;
    }
    
    if (expense.split_method === '50/50') {
      return expense.amount / 2;
    }
    
    return expense.amount;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-green-500 text-white">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-white p-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-center">Expense {actionText}!</h1>
          <p className="text-center mt-2 text-white/80">
            Thank you for your response
          </p>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-6">
              <div className="animate-spin h-8 w-8 border-4 border-famacle-blue border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading expense details...</p>
            </div>
          ) : expense ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{expense.description}</h2>
                <p className="text-gray-500 text-sm">{new Date(expense.date).toLocaleDateString()}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold">£{expense.amount.toFixed(2)}</span>
                </div>
                
                {action === 'approve' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Your Payment:</span>
                    <span className="font-semibold text-green-600">£{getPaymentAmount().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${action === 'approve' ? 'text-green-600' : 'text-amber-600'}`}>
                    {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                  </span>
                </div>
              </div>
              
              {action === 'approve' && (
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-800 mb-3">Make Payment</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full">
                      <CreditCard className="w-4 h-4 mr-2" />
                      PayPal
                    </Button>
                    <Button variant="outline" className="w-full">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Bank Transfer
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="text-center mt-6">
                <p className="text-gray-500 text-sm mb-4">
                  {action === 'approve' 
                    ? 'Please complete the payment to finalize this expense.' 
                    : 'The other parent will be notified about your request for clarification.'}
                </p>
                
                <div className="pt-4 border-t">
                  <Link to="/sign-up">
                    <Button variant="default" className="w-full">
                      Create Account to Track Expenses
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  
                  <Link to="/">
                    <Button variant="ghost" className="w-full mt-2">
                      Return to Homepage
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">Expense details not found</p>
              <Link to="/">
                <Button variant="default" className="mt-4">
                  Return to Homepage
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ExpenseSuccess;
