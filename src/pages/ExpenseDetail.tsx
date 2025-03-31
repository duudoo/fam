
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Expense } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import StatusBadge from "@/components/expenses/StatusBadge";
import CategoryBadge from "@/components/expenses/CategoryBadge";
import { formatCurrency } from "@/utils/expenseUtils";

const ExpenseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        if (!id) {
          setError("No expense ID provided");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("expenses")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching expense:", error);
          setError("Could not load expense details");
        } else {
          setExpense(data);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Card className="max-w-lg mx-auto p-6">
          <h1 className="text-xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-700 mb-6">{error || "Expense not found"}</p>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-famacle-slate">
            Expense Details
          </h1>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">{expense.description}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <StatusBadge status={expense.status} />
              <CategoryBadge category={expense.category} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-lg font-medium">
                {formatCurrency(expense.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-lg font-medium">
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {expense.notes && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Notes</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                {expense.notes}
              </p>
            </div>
          )}

          {expense.receiptUrl && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Receipt</p>
              <a
                href={expense.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-famacle-blue hover:underline flex items-center gap-1"
              >
                View Receipt <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-1">Split Method</p>
            <p className="text-gray-700">{expense.splitMethod}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExpenseDetail;
