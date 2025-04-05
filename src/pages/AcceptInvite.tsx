
import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { acceptInvite } from '@/lib/api/invites';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const inviteId = searchParams.get('id');
  
  useEffect(() => {
    const processInvite = async () => {
      if (!inviteId) {
        setError('Invalid invitation link. No invitation ID found.');
        setLoading(false);
        return;
      }
      
      // If user is not logged in, redirect to sign up with return URL
      if (!user) {
        // Store the invite ID in localStorage to process after login
        localStorage.setItem('pendingInviteId', inviteId);
        // Redirect to sign up page
        navigate(`/signup?returnTo=${encodeURIComponent(`/accept-invite?id=${inviteId}`)}`);
        return;
      }
      
      try {
        await acceptInvite(inviteId);
        setSuccess(true);
        toast.success('Invitation accepted successfully!');
        
        // Remove pending invite ID if it exists
        localStorage.removeItem('pendingInviteId');
      } catch (err) {
        console.error('Error accepting invitation:', err);
        setError('Could not accept the invitation. It may have expired or already been used.');
      } finally {
        setLoading(false);
      }
    };
    
    processInvite();
  }, [inviteId, user, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Processing Invitation</CardTitle>
            <CardDescription>Please wait while we process your invitation...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-12 w-12 animate-spin text-famacle-blue" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-red-500">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <CardTitle>Invitation Error</CardTitle>
            <CardDescription className="text-red-400">{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>Please check your invitation link or contact the person who invited you.</p>
            <div className="flex flex-col gap-2">
              <Link to="/signup">
                <Button className="w-full">Create an Account</Button>
              </Link>
              <Link to="/signin">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" className="w-full">Go to Homepage</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-green-500">
            <CheckCircle2 className="h-8 w-8 mb-2" />
            <CardTitle>Invitation Accepted</CardTitle>
            <CardDescription>You've successfully joined the Family Circle!</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>
              You can now collaborate on co-parenting tasks including calendars, 
              expenses, and communications with your co-parents.
            </p>
            <div className="flex flex-col gap-2">
              <Link to="/dashboard">
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
              <Link to="/settings">
                <Button variant="outline" className="w-full">View Family Circle</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // This should not be reached, but as a fallback
  return null;
};

export default AcceptInvite;
