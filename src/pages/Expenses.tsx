
import { useState, useEffect } from "react";
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
import { mockExpenses } from "@/utils/mockData";
import { Expense, ExpenseCategory } from "@/utils/types";
import { DollarSign, Filter, Plus, Search, SlidersHorizontal } from "lucide-react";

const ExpensesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Set page title
    document.title = "Expenses | Famacle";
    
    // Filter expenses based on status, category, and search query
    let filteredExpenses = [...mockExpenses];
    
    // Filter by status
    if (filter !== "all") {
      filteredExpenses = filteredExpenses.filter(expense => expense.status === filter);
    }
    
    // Filter by category
    if (categoryFilter !== "all") {
      filteredExpenses = filteredExpenses.filter(expense => expense.category === categoryFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredExpenses = filteredExpenses.filter(expense => 
        expense.description.toLowerCase().includes(query) ||
        expense.notes?.toLowerCase().includes(query)
      );
    }
    
    setExpenses(filteredExpenses);
  }, [filter, categoryFilter, searchQuery]);

  // Expense categories
  const categories: ExpenseCategory[] = [
    "medical",
    "education",
    "clothing",
    "activities",
    "food",
    "other",
  ];

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
              <ExpenseForm />
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
                    ${mockExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                  </p>
                </div>
                
                <div className="p-4 bg-famacle-teal-light/30 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
                  <p className="text-2xl font-bold text-famacle-slate">
                    ${mockExpenses
                      .filter(exp => exp.status === 'pending')
                      .reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                  </p>
                </div>
                
                <div className="p-4 bg-famacle-coral-light/30 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">This Month</p>
                  <p className="text-2xl font-bold text-famacle-slate">
                    ${mockExpenses
                      .filter(exp => {
                        const expMonth = new Date(exp.date).getMonth();
                        const expYear = new Date(exp.date).getFullYear();
                        const currentMonth = new Date().getMonth();
                        const currentYear = new Date().getFullYear();
                        return expMonth === currentMonth && expYear === currentYear;
                      })
                      .reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mb-6">
            <Tabs defaultValue="all" onValueChange={setFilter}>
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
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
