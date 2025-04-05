import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';
import Home from './pages/Home';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Communications from './pages/Communications';
import Demo from './pages/Demo';
import Expenses from './pages/Expenses';
import Settings from './pages/Settings';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Notifications from './pages/Notifications';
import VerifyEmail from './pages/VerifyEmail';
import UserManagementPage from './pages/UserManagement';
import ExpenseDetail from './pages/ExpenseDetail';
import ExpenseSuccess from './pages/ExpenseSuccess';
import ExpenseError from './pages/ExpenseError';
import AcceptInvite from './pages/AcceptInvite';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        } />
        <Route path="/communications" element={
          <ProtectedRoute>
            <Communications />
          </ProtectedRoute>
        } />
        <Route path="/expenses" element={
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        } />
        <Route path="/expense/:id" element={
          <ProtectedRoute>
            <ExpenseDetail />
          </ProtectedRoute>
        } />
        <Route path="/expense/success" element={
          <ProtectedRoute>
            <ExpenseSuccess />
          </ProtectedRoute>
        } />
        <Route path="/expense/error" element={
          <ProtectedRoute>
            <ExpenseError />
          </ProtectedRoute>
        } />
        <Route path="/demo" element={<Demo />} />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/user-management" element={
          <ProtectedRoute>
            <UserManagementPage />
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </Router>
  );
};

export default App;
