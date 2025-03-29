
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const ExpenseSuccess = () => {
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');
  const id = searchParams.get('id');
  const [expenseDetails, setExpenseDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenseDetails = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('description, amount, category, date')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setExpenseDetails(data);
      } catch (error) {
        console.error('Error fetching expense details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpenseDetails();
  }, [id]);

  const isApprove = action === 'approve';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className={`p-6 text-white ${isApprove ? 'bg-emerald-500' : 'bg-red-500'}`}>
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-white p-3">
              {isApprove ? (
                <Check className={`h-8 w-8 text-emerald-500`} />
              ) : (
                <X className={`h-8 w-8 text-red-500`} />
              )}
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-center">
            {isApprove ? 'Expense Approved' : 'Expense Disputed'}
          </h1>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin h-8 w-8 border-4 border-famacle-blue border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading expense details...</p>
            </div>
          ) : expenseDetails ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-500">
                  {isApprove 
                    ? 'You have successfully approved this expense.' 
                    : 'You have marked this expense as disputed.'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">{expenseDetails.description}</h3>
                <div className="mt-2 text-sm text-gray-500 space-y-1">
                  <p><span className="font-medium">Amount:</span> ${parseFloat(expenseDetails.amount).toFixed(2)}</p>
                  <p><span className="font-medium">Category:</span> {expenseDetails.category}</p>
                  <p><span className="font-medium">Date:</span> {new Date(expenseDetails.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              {isApprove && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">Payment Options</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Please select a payment method to complete this transaction:
                  </p>
                  <div className="mt-3 space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Pay via PayPal
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Pay via Stripe
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Record Manual Payment
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Could not load expense details.</p>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Link to="/">
              <Button variant="ghost" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSuccess;
