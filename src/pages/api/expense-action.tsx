
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const ExpenseAction = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const token = searchParams.get('token');
  const action = searchParams.get('action');

  useEffect(() => {
    const handleExpenseAction = async () => {
      if (!token || !action) {
        navigate('/expense-error?reason=invalid-parameters');
        return;
      }

      try {
        setLoading(true);
        // Call the edge function to handle the action
        const { data, error } = await supabase.functions.invoke('handle-expense-action', {
          body: { token, action }
        });

        if (error) {
          console.error('Error handling expense action:', error);
          navigate('/expense-error?reason=server-error');
          return;
        }

        if (data?.error) {
          console.error('Server returned error:', data.error);
          navigate(`/expense-error?reason=${data.error}`);
          return;
        }

        // Redirect to success page
        navigate(`/expense-success?action=${action}&id=${data.expenseId}`);
      } catch (error) {
        console.error('Error handling expense action:', error);
        navigate('/expense-error?reason=server-error');
      } finally {
        setLoading(false);
      }
    };

    handleExpenseAction();
  }, [token, action, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-famacle-blue animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Processing your request...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-famacle-blue text-white rounded hover:bg-famacle-blue-dark"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ExpenseAction;
