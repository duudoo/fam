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

import ExpenseDetailsSection, { formSchema, FormValues } from './ExpenseDetailsSection';
import ReceiptUploadSection from './ReceiptUploadSection';
import NotesSection from './NotesSection';
import FormActions from './FormActions';
import ChildrenSelectionSection from './ChildrenSelectionSection';

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
      splitMethod: "50/50" as SplitMethod,
      notes: "",
      childIds: []
    },
  });
  
  const handleReceiptUpload = (url: string) => {
    setReceiptUrl(url);
  };

  const sendExpenseNotification = async (expenseData: any, approvalToken: string) => {
    try {
      const { data: parentChildren, error: pcError } = await supabase
        .from('parent_children')
        .select(`
          child_id,
          parent_id
        `)
        .in('child_id', expenseData.childIds || []);
      
      if (pcError) throw pcError;
      
      const childParents = parentChildren.reduce((acc, pc) => {
        if (!acc[pc.child_id]) acc[pc.child_id] = [];
        if (pc.parent_id !== user?.id) acc[pc.child_id].push(pc.parent_id);
        return acc;
      }, {} as Record<string, string[]>);
      
      const coParentIds = Array.from(
        new Set(
          Object.values(childParents).flat()
        )
      );
      
      if (coParentIds.length === 0) {
        console.log("No co-parents found to notify");
        return;
      }
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', coParentIds);
      
      if (profilesError) throw profilesError;
      
      const { data: currentProfile, error: currentProfileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user?.id)
        .single();
      
      if (currentProfileError) throw currentProfileError;
      
      const formattedDate = format(new Date(expenseData.date), 'MMM d, yyyy');
      const frontendUrl = window.location.origin;
      
      const totalAmount = parseFloat(expenseData.amount);
      const splitMethod = expenseData.splitMethod;
      
      let splitAmounts: Record<string, number> = {};
      
      splitAmounts[user?.id || ''] = totalAmount;
      
      if (splitMethod === '50/50' && coParentIds.length > 0) {
        const amountPerParent = totalAmount / 2;
        splitAmounts[user?.id || ''] = amountPerParent;
        
        coParentIds.forEach(coParentId => {
          splitAmounts[coParentId] = amountPerParent;
        });
      }
      
      const { error: splitError } = await supabase
        .from('expenses')
        .update({ split_amounts: splitAmounts })
        .eq('id', expenseData.id);
        
      if (splitError) {
        console.error("Error updating split amounts:", splitError);
      }
      
      const notificationPromises = profiles.map(async (profile) => {
        const coParentAmount = splitAmounts[profile.id] || 0;
        
        const { data: notification, error: notifError } = await supabase
          .from('expense_notifications')
          .insert({
            expense_id: expenseData.id,
            sent_to: profile.email,
            token: approvalToken,
            notification_type: 'expense_approval',
            amount: coParentAmount
          })
          .select()
          .single();
        
        if (notifError) throw notifError;
        
        const approveUrl = `${frontendUrl}/api/expense-action?token=${approvalToken}&action=approve`;
        const clarifyUrl = `${frontendUrl}/api/expense-action?token=${approvalToken}&action=clarify`;
        
        await supabase.functions.invoke('send-expense-notification', {
          body: {
            expenseId: expenseData.id,
            recipientEmail: profile.email,
            expenseAmount: parseFloat(expenseData.amount),
            expenseDescription: expenseData.description,
            recipientAmount: coParentAmount,
            category: expenseData.category,
            date: formattedDate,
            payerName: currentProfile.full_name || "A co-parent",
            receiptUrl,
            approvalToken,
            approveUrl,
            clarifyUrl
          }
        });
        
        console.log(`Notification sent to ${profile.email} with amount ${coParentAmount}`);
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
        
        if (newExpense) {
          const { data: expenseData, error: expenseError } = await supabase
            .from('expenses')
            .select('id, approval_token')
            .eq('id', newExpense.id)
            .single();
            
          if (!expenseError && expenseData) {
            await sendExpenseNotification({
              id: newExpense.id,
              description: values.description,
              amount: values.amount,
              date: format(values.date, 'yyyy-MM-dd'),
              category: values.category,
              splitMethod: values.splitMethod,
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
