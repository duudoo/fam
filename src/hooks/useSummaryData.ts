
import { useState, useEffect } from 'react';
import { Expense, Event, ExpenseStatus } from '@/utils/types';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useSummaryData = () => {
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
  
  // Calculate derived data
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter(exp => exp.status === 'pending');
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= new Date();
    })
    .sort((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    })
    .slice(0, 3);

  return {
    loading,
    totalExpenses,
    pendingExpenses,
    upcomingEvents
  };
};
