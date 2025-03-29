
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { useExpenseMutations } from '@/hooks/expenses';
import { ExpenseCategory, SplitMethod, Expense } from '@/utils/types';
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";

// Import the form sections
import ExpenseDetailsSection, { formSchema, FormValues } from './ExpenseDetailsSection';
import ReceiptUploadSection from './ReceiptUploadSection';
import NotesSection from './NotesSection';
import FormActions from './FormActions';
import ChildrenSelectionSection from './ChildrenSelectionSection';

// Define props interface
interface ExpenseFormProps {
  expense?: Expense;
  onExpenseAdded?: () => void;
  onCancel?: () => void;
}

const ExpenseForm = ({ expense, onExpenseAdded, onCancel }: ExpenseFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string>(expense?.receiptUrl || '');
  const isEditing = !!expense;
  
  const { createExpense, updateExpense } = useExpenseMutations(user?.id);
  
  const categories: ExpenseCategory[] = [
    'medical',
    'education',
    'clothing',
    'activities',
    'food',
    'other'
  ];
  
  const splitMethods: SplitMethod[] = [
    'none',
    '50/50',
    'income-based',
    'custom'
  ];
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: expense ? {
      description: expense.description,
      amount: expense.amount.toString(),
      date: new Date(expense.date),
      category: expense.category,
      splitMethod: expense.splitMethod,
      notes: expense.notes || "",
      childIds: expense.childIds || []
    } : {
      description: "",
      amount: "",
      date: new Date(),
      category: "education" as ExpenseCategory,
      splitMethod: "none" as SplitMethod,
      notes: "",
      childIds: []
    },
  });
  
  const handleReceiptUpload = (url: string) => {
    setReceiptUrl(url);
  };

  // Function to send email notification for expense approval
  const sendExpenseNotification = async (expenseData: any, approvalToken: string) => {
    try {
      // Get co-parent email
      const { data: parentChildren, error: pcError } = await supabase
        .from('parent_children')
        .select(`
          child_id,
          parent_id
        `)
        .in('child_id', expenseData.childIds || []);
      
      if (pcError) throw pcError;
      
      // Find co-parent IDs (parents who share a child with the current user)
      const childParents = parentChildren.reduce((acc, pc) => {
        if (!acc[pc.child_id]) acc[pc.child_id] = [];
        if (pc.parent_id !== user?.id) acc[pc.child_id].push(pc.parent_id);
        return acc;
      }, {} as Record<string, string[]>);
      
      // Get unique co-parent IDs
      const coParentIds = Array.from(
        new Set(
          Object.values(childParents).flat()
        )
      );
      
      if (coParentIds.length === 0) {
        console.log("No co-parents found to notify");
        return;
      }
      
      // Get co-parent emails
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', coParentIds);
      
      if (profilesError) throw profilesError;
      
      // Get current user profile for sender name
      const { data: currentProfile, error: currentProfileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user?.id)
        .single();
      
      if (currentProfileError) throw currentProfileError;
      
      const formattedDate = format(new Date(expenseData.date), 'MMM d, yyyy');
      const frontendUrl = window.location.origin;
      
      // Send email notification to each co-parent
      const notificationPromises = profiles.map(async (profile) => {
        // Create a record of the notification
        const { data: notification, error: notifError } = await supabase
          .from('expense_notifications')
          .insert({
            expense_id: expenseData.id,
            sent_to: profile.email,
            token: approvalToken,
            notification_type: 'expense_approval'
          })
          .select()
          .single();
        
        if (notifError) throw notifError;
        
        const approveUrl = `${frontendUrl}/api/expense-action?token=${approvalToken}&action=approve`;
        const disputeUrl = `${frontendUrl}/api/expense-action?token=${approvalToken}&action=dispute`;
        
        // Call the edge function to send the email
        await supabase.functions.invoke('send-expense-notification', {
          body: {
            expenseId: expenseData.id,
            recipientEmail: profile.email,
            expenseAmount: parseFloat(expenseData.amount),
            expenseDescription: expenseData.description,
            category: expenseData.category,
            date: formattedDate,
            payerName: currentProfile.full_name || "A co-parent",
            receiptUrl,
            approvalToken,
            approveUrl,
            disputeUrl
          }
        });
        
        console.log(`Notification sent to ${profile.email}`);
      });
      
      await Promise.all(notificationPromises);
      toast.success("Expense notifications sent to co-parents");
    } catch (error) {
      console.error("Failed to send expense notification:", error);
      toast.error("Failed to send notifications. Co-parents will still see the expense in the app.");
    }
  };
  
  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error("You must be signed in to add an expense");
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isEditing && expense) {
        // Update existing expense using the mutation
        const updatedExpense = await updateExpense.mutateAsync({
          id: expense.id,
          updates: {
            description: values.description,
            amount: parseFloat(values.amount),
            date: format(values.date, 'yyyy-MM-dd'),
            category: values.category as ExpenseCategory,
            splitMethod: values.splitMethod as SplitMethod,
            notes: values.notes || undefined,
            receiptUrl: receiptUrl || undefined,
            childIds: values.childIds
          }
        });
      } else {
        // Add new expense using the mutation
        const newExpense = await createExpense.mutateAsync({
          description: values.description,
          amount: parseFloat(values.amount),
          date: format(values.date, 'yyyy-MM-dd'),
          category: values.category as ExpenseCategory,
          status: 'pending',
          splitMethod: values.splitMethod as SplitMethod,
          notes: values.notes || undefined,
          receiptUrl: receiptUrl || undefined,
          paidBy: user.id,
          childIds: values.childIds
        });
        
        // Get the approval token from the newly created expense
        if (newExpense) {
          const { data: expenseData, error: expenseError } = await supabase
            .from('expenses')
            .select('id, approval_token')
            .eq('id', newExpense.id)
            .single();
            
          if (!expenseError && expenseData) {
            // Send email notification for approval
            await sendExpenseNotification({
              id: newExpense.id,
              description: values.description,
              amount: values.amount,
              date: format(values.date, 'yyyy-MM-dd'),
              category: values.category,
              childIds: values.childIds
            }, expenseData.approval_token);
          }
        }
      }
      
      form.reset();
      setReceiptUrl('');
      
      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (error) {
      console.error(isEditing ? "Error updating expense:" : "Error adding expense:", error);
      toast.error(isEditing ? "Failed to update expense" : "Failed to add expense");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-lg mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {isEditing ? "Edit Expense" : "Add New Expense"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ExpenseDetailsSection 
              form={form} 
              categories={categories} 
              splitMethods={splitMethods} 
            />
            
            <ChildrenSelectionSection 
              defaultSelectedIds={expense?.childIds}
            />
            
            <ReceiptUploadSection 
              onFileUpload={handleReceiptUpload}
              existingReceiptUrl={expense?.receiptUrl}
            />
            
            <NotesSection form={form} />
            
            <FormActions 
              onCancel={onCancel} 
              isSubmitting={isSubmitting} 
              isEditing={isEditing}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
