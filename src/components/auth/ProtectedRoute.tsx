
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check authentication status on initial load and display a message
  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to access this page", {
        id: "auth-required",
      });
    }
  }, [loading, user]);

  // If still loading auth state, show a loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If not authenticated, redirect to sign in page
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
