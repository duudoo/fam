import { DollarSign, FileText, Calendar, CreditCard, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, parseISO } from 'date-fns';
import { Event, Expense, ExpenseStatus } from '@/utils/types';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const SummaryCards = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);
  
  const fetchData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (expensesError) throw expensesError;
      
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });
        
      if (eventsError) throw eventsError;
      
      if (expensesData) {
        setExpenses(expensesData.map(exp => ({
          id: exp.id,
          description: exp.description,
          amount: parseFloat(exp.amount),
          date: exp.date,
          category: exp.category,
          paidBy: exp.paid_by,
          receiptUrl: exp.receipt_url || undefined,
          status: exp.status as ExpenseStatus,
          splitMethod: exp.split_method,
          notes: exp.notes || undefined,
          createdAt: exp.created_at,
          updatedAt: exp.updated_at
        })));
      }
      
      if (eventsData) {
        setEvents(eventsData.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description || undefined,
          startDate: event.start_date,
          endDate: event.end_date || undefined,
          allDay: event.all_day,
          location: event.location || undefined,
          priority: event.priority,
          createdBy: event.created_by,
          reminders: [], // Add empty reminders array to comply with Event type
          createdAt: event.created_at,
          updatedAt: event.updated_at
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Filter pending expenses
  const pendingExpenses = expenses.filter(exp => exp.status === 'pending');
  
  // Filter upcoming events
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= new Date();
    })
    .sort((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    })
    .slice(0, 3);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="h-32 flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
        </Card>
        <Card className="h-32 flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
        </Card>
        <Card className="h-32 flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ExpenseTotalCard total={totalExpenses} />
      <PendingExpensesCard pendingExpenses={pendingExpenses} />
      <UpcomingEventsCard upcomingEvents={upcomingEvents} />
    </div>
  );
};

interface ExpenseTotalCardProps {
  total: number;
}

const ExpenseTotalCard = ({ total }: ExpenseTotalCardProps) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
        <DollarSign className="w-5 h-5 mr-2 text-famacle-blue" />
        Total Expenses
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-famacle-slate">${total.toFixed(2)}</div>
      <p className="text-gray-500 text-sm">Last updated today</p>
    </CardContent>
    <div className="absolute top-0 right-0 p-3">
      <Avatar className="h-10 w-10 border-2 border-white">
        <AvatarFallback>$</AvatarFallback>
      </Avatar>
    </div>
  </Card>
);

interface PendingExpensesCardProps {
  pendingExpenses: Expense[];
}

const PendingExpensesCard = ({ pendingExpenses }: PendingExpensesCardProps) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-famacle-teal" />
        Pending Approval
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-famacle-slate">{pendingExpenses.length}</div>
      <p className="text-gray-500 text-sm">
        {pendingExpenses.length > 0 
          ? `$${pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)} pending`
          : 'No pending expenses'}
      </p>
    </CardContent>
    <div className="absolute top-0 right-0 p-3">
      <CreditCard className="w-6 h-6 text-famacle-teal" />
    </div>
  </Card>
);

interface UpcomingEventsCardProps {
  upcomingEvents: Event[];
}

const UpcomingEventsCard = ({ upcomingEvents }: UpcomingEventsCardProps) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-famacle-coral" />
        Upcoming Events
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-famacle-slate">{upcomingEvents.length}</div>
      <p className="text-gray-500 text-sm">
        Next: {upcomingEvents.length > 0 
          ? format(new Date(upcomingEvents[0].startDate), 'MMM d')
          : 'No upcoming events'}
      </p>
    </CardContent>
    <div className="absolute top-0 right-0 p-3">
      <Bell className="w-6 h-6 text-famacle-coral" />
    </div>
  </Card>
);

export default SummaryCards;
