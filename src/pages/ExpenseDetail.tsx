
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Expense } from "@/utils/types";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Receipt, Clock, Calendar, DollarSign, Tag, User, SplitSquareVertical } from "lucide-react";
import { formatCurrency } from "@/utils/expenseUtils";
import { format } from "date-fns";
import CategoryBadge from "@/components/expenses/CategoryBadge";
import StatusBadge from "@/components/expenses/StatusBadge";
import ExpenseStatusMenu from "@/components/expenses/ExpenseStatusMenu";
import { useCurrency } from "@/contexts/CurrencyContext";
import { toast } from "sonner";

const ExpenseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currency } = useCurrency();
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const fetchExpense = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('expenses')
          .select(`
            *,
            expense_children (
              child_id,
              expense_id
            )
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Transform the data to match our Expense type
          const childIds = data.expense_children ? 
            data.expense_children.map((ec: any) => ec.child_id) : 
            [];
            
          const transformedExpense: Expense = {
            id: data.id,
            description: data.description,
            amount: data.amount,
            date: data.date,
            category: data.category,
            paidBy: data.paid_by,
            receiptUrl: data.receipt_url,
            status: data.status,
            splitMethod: data.split_method,
            splitPercentage: data.split_percentage,
            splitAmounts: data.split_amounts,
            notes: data.notes,
            disputeNotes: data.dispute_notes,
            childIds,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
          
          setExpense(transformedExpense);
        }
      } catch (err: any) {
        console.error("Error fetching expense:", err);
        setError(err.message || "Failed to load expense details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpense();
  }, [id]);
  
  const handleBack = () => {
    navigate('/expenses');
  };

  const handleStatusChange = () => {
    // This will be passed to ExpenseStatusMenu to handle status changes
    // When status changes, we don't need to do anything special here
    // as we'll reload the page to refresh the data
  };

  const handleDelete = async () => {
    if (!expense || !user) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expense.id);
      
      if (error) throw error;
      
      toast.success("Expense deleted successfully");
      navigate('/expenses');
    } catch (err: any) {
      console.error("Error deleting expense:", err);
      toast.error("Failed to delete expense");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6 flex items-center"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Expenses
        </Button>
        
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center h-64">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
                <p className="text-gray-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : expense ? (
          <Card className="animate-fade-in">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">{expense.description}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <CategoryBadge category={expense.category} />
                    <StatusBadge status={expense.status} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-famacle-slate">
                    {formatCurrency(expense.amount, currency.symbol)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(new Date(expense.date), 'PPP')}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              <Separator className="mb-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p>{format(new Date(expense.date), 'PPP')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Category</p>
                      <p className="capitalize">{expense.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Paid By</p>
                      <p>{user?.id === expense.paidBy ? "You" : "Co-parent"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created</p>
                      <p>{format(new Date(expense.createdAt), 'PPP')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Amount</p>
                      <p>{formatCurrency(expense.amount, currency.symbol)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <SplitSquareVertical className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Split Method</p>
                      <p className="capitalize">{expense.splitMethod}</p>
                    </div>
                  </div>
                  
                  {expense.receiptUrl && (
                    <div className="flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Receipt</p>
                        <a 
                          href={expense.receiptUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-famacle-blue hover:underline"
                        >
                          View Receipt
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {user && user.id === expense.paidBy && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 mb-2">Update Status</p>
                      <ExpenseStatusMenu 
                        expenseId={expense.id}
                        currentStatus={expense.status}
                        isProcessing={isDeleting}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {expense.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Notes</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{expense.notes}</p>
                </div>
              )}
              
              {expense.disputeNotes && (
                <div className="mt-6 p-4 bg-red-50 rounded-md border border-red-100">
                  <h3 className="text-lg font-medium text-red-600 mb-2">Dispute Notes</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{expense.disputeNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center h-64">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Expense Not Found</h2>
                <p className="text-gray-600">The expense you're looking for doesn't exist or has been removed.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ExpenseDetailPage;
