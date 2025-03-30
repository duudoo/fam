
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useExpenses } from "@/hooks/expenses";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ExpenseForm from "@/components/expenses/form/ExpenseForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

// Import refactored components
import ExpenseOverview from "@/components/expenses/ExpenseOverview";
import ExpenseFilters from "@/components/expenses/ExpenseFilters";
import ExpenseList from "@/components/expenses/ExpenseList";

const ExpensesPage = () => {
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  
  const {
    expenses,
    isLoading,
    filter,
    setFilter,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    subscribeToExpenses
  } = useExpenses();
  
  // Check for newExpense query parameter
  useEffect(() => {
    const newExpense = searchParams.get("newExpense");
    if (newExpense === "true") {
      setShowForm(true);
    }
  }, [searchParams]);
  
  // Set up real-time subscription
  useEffect(() => {
    const channel = subscribeToExpenses();
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, subscribeToExpenses]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-xl font-semibold text-famacle-slate mb-2">Please Sign In</h2>
            <p className="text-gray-500">You need to be signed in to view and manage expenses.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-famacle-slate">Expenses</h1>
                <p className="text-gray-500 mt-1">Track and manage child-related expenses</p>
              </div>
              
              <Button onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    New Expense
                  </>
                )}
              </Button>
            </div>
            
            {showForm && (
              <div className="mb-8">
                <ExpenseForm 
                  onExpenseAdded={() => setShowForm(false)} 
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}

            <ExpenseOverview expenses={expenses} />
            
            <div className="mb-6">
              <Tabs defaultValue="all" onValueChange={value => setFilter(value as any)}>
                <ExpenseFilters 
                  filter={filter}
                  setFilter={setFilter}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
                
                <TabsContent value="all" className="mt-0">
                  <ExpenseList 
                    expenses={expenses} 
                    onAddNewClick={() => setShowForm(true)} 
                  />
                </TabsContent>
                
                {["pending", "approved", "paid", "disputed"].map((status) => (
                  <TabsContent key={status} value={status} className="mt-0">
                    <ExpenseList 
                      expenses={expenses} 
                      filteredStatus={status} 
                      onAddNewClick={() => setShowForm(true)} 
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </CurrencyProvider>
  );
};

export default ExpensesPage;
