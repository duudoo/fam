
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ExpenseError = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');

  useEffect(() => {
    // Log the error reason for debugging
    console.error('Expense action error:', reason);
  }, [reason]);

  // Get human-readable error message
  const getErrorMessage = (reasonCode: string | null) => {
    switch (reasonCode) {
      case 'invalid-parameters':
        return 'Invalid or missing parameters in the request.';
      case 'not-found':
        return 'The expense could not be found or has already been processed.';
      case 'notification-update-failed':
        return 'Failed to update the notification status.';
      case 'update-failed':
        return 'Failed to update the expense status.';
      case 'server-error':
        return 'An unexpected server error occurred.';
      default:
        return 'An unknown error occurred.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-red-500 text-white">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-white p-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-center">Action Failed</h1>
        </div>
        
        <div className="p-6">
          <div className="text-center">
            <p className="text-gray-500 mb-6">
              Sorry, we couldn't process your expense action.
            </p>
            
            <div className="bg-red-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-red-900">Error Details</h3>
              <p className="mt-1 text-sm text-red-700">
                {getErrorMessage(reason)}
              </p>
            </div>
            
            <p className="text-gray-500 mb-4">
              You can try again or log in to your account to manage this expense.
            </p>
            
            <div className="flex flex-col space-y-2">
              <Link to="/">
                <Button variant="default" className="w-full">
                  Go to Homepage
                </Button>
              </Link>
              
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              
              <Link to="/contact">
                <Button variant="ghost" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseError;
