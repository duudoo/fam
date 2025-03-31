
import {
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Calendar from './pages/Calendar';
import Communications from './pages/Communications';
import Notifications from './pages/Notifications';
import Navbar from '@/components/Navbar';
import UserManagementPage from './pages/UserManagement';
import Settings from './pages/Settings';
import VerifyEmailPage from './pages/VerifyEmail';
import Demo from './pages/Demo';
import ExpenseSuccess from './pages/ExpenseSuccess';
import ExpenseError from './pages/ExpenseError';
import ExpenseDetail from './pages/ExpenseDetail';
import { Toaster } from '@/components/ui/sonner';

const App = () => {
  const { user, loading } = useAuth();

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <div>Loading...</div>; // Or a loading spinner
    }
    if (!user) {
      return <Navigate to="/signin" />;
    }
    return <>{children}</>;
  };

  const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <div>Loading...</div>; // Or a loading spinner
    }
    if (user) {
      return <Navigate to="/dashboard" />;
    }
    return <>{children}</>;
  };

  return (
    <div className="App">
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={
          <PublicOnlyRoute>
            <SignIn />
          </PublicOnlyRoute>
        } />
        <Route path="/signup" element={
          <PublicOnlyRoute>
            <SignUp />
          </PublicOnlyRoute>
        } />
        <Route path="/verify-email" element={
          <PublicOnlyRoute>
            <VerifyEmailPage />
          </PublicOnlyRoute>
        } />
        <Route path="/demo" element={<Demo />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Navbar />
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/expenses" element={
          <ProtectedRoute>
            <Navbar />
            <Expenses />
          </ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute>
            <Navbar />
            <Calendar />
          </ProtectedRoute>
        } />
        <Route path="/communications" element={
          <ProtectedRoute>
            <Navbar />
            <Communications />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Navbar />
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/user-management" element={
          <ProtectedRoute>
            <Navbar />
            <UserManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Navbar />
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* Public routes for expense approval flow */}
        <Route path="/expense-success" element={<ExpenseSuccess />} />
        <Route path="/expense-error" element={<ExpenseError />} />
        <Route path="/expenses/:id" element={<ExpenseDetail />} />
      </Routes>
    </div>
  );
};

export default App;
