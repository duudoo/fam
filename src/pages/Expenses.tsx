
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useExpenses } from "@/hooks/useExpenses";
import Navbar from "@/components/Navbar";
import ExpenseCard from "@/components/ExpenseCard";
import ExpenseForm from "@/components/ExpenseForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ExpenseCategory } from "@/utils/types";
import { DollarSign, Filter, Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ExpensesPage = () => {
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
  
  // Set up real-time subscription
  useEffect(() => {
    const channel = subscribeToExpenses();
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter(exp => exp.status === 'pending');
  
  // Get current month expenses
  const currentMonthExpenses = expenses.filter(exp => {
    const expMonth = new Date(exp.date).getMonth();
    const expYear = new Date(exp.date).getFullYear();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return expMonth === currentMonth && expYear === currentYear;
  });

  // Expense categories
  const categories: ExpenseCategory[] = [
    "medical",
    "education",
    "clothing",
    "activities",
    "food",
    "other",
  ];

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

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-famacle-blue" />
                Expense Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-famacle-blue-light/30 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-famacle-slate">
                    ${totalExpenses.toFixed(2)}
                  </p>
                </div>
                
                <div className="p-4 bg-famacle-teal-light/30 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
                  <p className="text-2xl font-bold text-famacle-slate">
                    ${pendingExpenses
                      .reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                  </p>
                </div>
                
                <div className="p-4 bg-famacle-coral-light/30 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">This Month</p>
                  <p className="text-2xl font-bold text-famacle-slate">
                    ${currentMonthExpenses
                      .reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mb-6">
            <Tabs defaultValue="all" onValueChange={value => setFilter(value as any)}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <TabsList className="w-full md:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="disputed">Disputed</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Search expenses..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Select value={categoryFilter as string} onValueChange={value => setCategoryFilter(value as any)}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Category" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="capitalize">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {expenses.length > 0 ? (
                    expenses.map((expense) => (
                      <ExpenseCard key={expense.id} expense={expense} />
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-16">
                      <p className="text-gray-500">No matching expenses found.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setShowForm(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Expense
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {["pending", "approved", "paid", "disputed"].map((status) => (
                <TabsContent key={status} value={status} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {expenses.filter(expense => expense.status === status).length > 0 ? (
                      expenses
                        .filter(expense => expense.status === status)
                        .map((expense) => (
                          <ExpenseCard key={expense.id} expense={expense} />
                        ))
                    ) : (
                      <div className="col-span-3 text-center py-16">
                        <p className="text-gray-500">No {status} expenses found.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExpensesPage;
