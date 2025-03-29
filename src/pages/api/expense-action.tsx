
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const ExpenseAction = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const action = searchParams.get('action');

  useEffect(() => {
    const handleExpenseAction = async () => {
      if (!token || !action) {
        navigate('/expense-error?reason=invalid-parameters');
        return;
      }

      try {
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
      }
    };

    handleExpenseAction();
  }, [token, action, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-famacle-blue border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing your request...</p>
      </div>
    </div>
  );
};

export default ExpenseAction;
