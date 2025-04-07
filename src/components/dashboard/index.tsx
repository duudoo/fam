
import React, { useState, useCallback, memo, useEffect } from "react";
import DashboardHeader from "./DashboardHeader";
import SummaryCards from "./SummaryCards";
import MonthlySummary from "./MonthlySummary";
import ExpensesSection from "./ExpensesSection";
import NotificationsCard from "./NotificationsCard";
import { useAuth } from "@/hooks/useAuth";
import { useExpenses } from "@/hooks/expenses";
import { useIsMobile } from "@/hooks/use-mobile";
import AddEventDialog from "../calendar/AddEventDialog";
import ExpenseDetailDialog from "../expenses/ExpenseDetailDialog";
import { Expense } from "@/utils/types";

// Memoize the Dashboard component to prevent unnecessary re-renders
const Dashboard = memo(() => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { expenses = [], isLoading } = useExpenses();
  const [openAddEvent, setOpenAddEvent] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Set initialized state after first render to prevent layout shifts
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const handleScheduleEvent = useCallback(() => {
    setOpenAddEvent(true);
  }, []);

  const handleExpenseClick = useCallback((expense: Expense) => {
    setSelectedExpense(expense);
    setDetailDialogOpen(true);
  }, []);

  if (!user) {
    return (
      <div className="container mx-auto p-4 pt-24">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Please sign in to view your dashboard.</p>
      </div>
    );
  }

  // Add CSS class to control visibility based on initialization state
  const contentClass = isInitialized ? "opacity-100 transition-opacity" : "opacity-0";

  return (
    <div className="container mx-auto p-4 pb-16 min-h-[calc(100vh-4rem)]">
      <div className={contentClass}>
        <DashboardHeader onScheduleEvent={handleScheduleEvent} />

        <SummaryCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <MonthlySummary />
            
            <div className="mt-6">
              <ExpensesSection 
                expenses={expenses} 
                isLoading={isLoading}
                onExpenseClick={handleExpenseClick} 
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <NotificationsCard />
          </div>
        </div>

        {/* Event dialog */}
        <AddEventDialog 
          open={openAddEvent} 
          onOpenChange={setOpenAddEvent} 
        />

        {/* Expense Detail Dialog */}
        {selectedExpense && (
          <ExpenseDetailDialog
            expense={selectedExpense}
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
          />
        )}
      </div>
    </div>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
