
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import ExpenseDetailSkeleton from "@/components/expenses/detail/ExpenseDetailSkeleton";
import ExpenseDetailError from "@/components/expenses/detail/ExpenseDetailError";
import ExpenseNotFound from "@/components/expenses/detail/ExpenseNotFound";
import ExpenseDetailContent from "@/components/expenses/detail/ExpenseDetailContent";
import { useExpenseDetail } from "@/hooks/expenses/useExpenseDetail";
import Navbar from "@/components/Navbar";

const ExpenseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currency } = useCurrency();
  const { 
    expense, 
    loading, 
    error, 
    isDeleting, 
    handleDelete, 
    handleStatusChange 
  } = useExpenseDetail(id);
  
  const handleBack = () => {
    navigate('/expenses');
  };

  const onDelete = () => {
    if (!expense || !user) return;
    handleDelete(expense.id);
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
          <ExpenseDetailSkeleton />
        ) : error ? (
          <ExpenseDetailError error={error} />
        ) : expense ? (
          <ExpenseDetailContent 
            expense={expense}
            currentUserId={user?.id || ''}
            currency={currency}
            isDeleting={isDeleting}
            onStatusChange={handleStatusChange}
            onDelete={onDelete}
          />
        ) : (
          <ExpenseNotFound />
        )}
      </main>
    </div>
  );
};

export default ExpenseDetailPage;
