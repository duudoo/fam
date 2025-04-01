
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Monitor session health
  useEffect(() => {
    // If we have user but no valid session, something is wrong
    if (user && !session) {
      console.warn("Invalid auth state: user exists but no session");
    }
    
    // Check for session expiration
    if (session) {
      const expiry = new Date(session.expires_at * 1000);
      const now = new Date();
      
      // If expiring within 5 minutes, log the upcoming expiration
      if ((expiry.getTime() - now.getTime()) < 5 * 60 * 1000) {
        console.warn("Session expiring soon:", {
          expiresAt: expiry.toISOString(),
          now: now.toISOString(),
          timeLeft: Math.round((expiry.getTime() - now.getTime()) / 1000) + ' seconds'
        });
      }
    }
  }, [user, session]);

  // Check authentication status on initial load
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
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
