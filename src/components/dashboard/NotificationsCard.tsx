
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getNotificationIcon } from '@/components/notifications/NotificationIcon';
import ExpenseDetailDialog from '@/components/expenses/ExpenseDetailDialog';
import { Expense } from '@/utils/types';

const NotificationsCard = () => {
  const { user } = useAuth();
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  // Fetch recent notifications from Supabase
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['dashboard-notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      return data.map(notification => ({
        id: notification.id,
        type: notification.type,
        message: notification.message,
        createdAt: notification.created_at,
        read: notification.read,
        relatedId: notification.related_id
      }));
    },
    enabled: !!user
  });

  // Handle click on an expense notification
  const handleExpenseClick = async (expenseId: string) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', expenseId)
        .single();
      
      if (error) {
        console.error('Error fetching expense details:', error);
        return;
      }
      
      if (data) {
        const expense: Expense = {
          id: data.id,
          description: data.description,
          amount: data.amount,
          date: data.date,
          category: data.category,
          paidBy: data.paid_by,
          receiptUrl: data.receipt_url || undefined,
          status: data.status,
          splitMethod: data.split_method,
          notes: data.notes || undefined,
          childIds: [],
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        setSelectedExpense(expense);
        setDetailDialogOpen(true);
      }
    } catch (error) {
      console.error('Error handling expense click:', error);
    }
  };
    
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md font-medium flex items-center">
            <Bell className="w-4 h-4 mr-2 text-famacle-blue" />
            Notifications
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="text-xs">
            <Link to="/notifications" className="flex items-center text-famacle-blue">
              View All
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin h-6 w-6 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "p-3 rounded-lg border flex items-start gap-3",
                    notification.read 
                      ? "border-gray-200" 
                      : "border-famacle-blue-light bg-famacle-blue-light/30"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center rounded-full w-8 h-8 shrink-0",
                    notification.type.includes('expense') 
                      ? "bg-famacle-blue-light text-famacle-blue" 
                      : notification.type.includes('event')
                        ? "bg-famacle-coral-light text-famacle-coral"
                        : "bg-gray-100 text-famacle-slate"
                  )}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                    </p>
                    {notification.type.includes('expense_shared') && notification.relatedId && (
                      <div className="mt-1">
                        <button 
                          onClick={() => handleExpenseClick(notification.relatedId!)}
                          className="text-xs text-famacle-blue hover:underline"
                        >
                          View Expense Details
                        </button>
                      </div>
                    )}
                    {notification.type.includes('expense_shared') && !notification.relatedId && (
                      <div className="mt-1">
                        <Link 
                          to="/communications" 
                          className="text-xs text-famacle-blue hover:underline"
                        >
                          View in Communications
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>

      {/* Expense Detail Dialog */}
      {selectedExpense && (
        <ExpenseDetailDialog
          expense={selectedExpense}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
        />
      )}
    </Card>
  );
};

export default NotificationsCard;
