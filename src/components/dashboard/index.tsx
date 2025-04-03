
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import DashboardHeader from "./DashboardHeader";
import SummaryCards from "./SummaryCards";
import MonthlySummary from "./MonthlySummary";
import ExpensesSection from "./ExpensesSection";
import NotificationsCard from "./NotificationsCard";
import UpcomingEventsCard from "./UpcomingEventsCard";
import { useAuth } from "@/hooks/useAuth";
import { useExpenses } from "@/hooks/expenses";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { expenses = [], isLoading } = useExpenses();

  if (!user) {
    return (
      <div className="container mx-auto p-4 pt-24">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Please sign in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pb-16">
      <DashboardHeader />

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <MonthlySummary />
          
          <Card className="mt-6">
            <CardContent className="pt-6">
              <ExpensesSection 
                expenses={expenses} 
                isLoading={isLoading} 
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <NotificationsCard />
          <UpcomingEventsCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
