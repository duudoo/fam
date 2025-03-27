
import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "./DashboardHeader";
import SummaryCards from "./SummaryCards";
import ExpensesSection from "./ExpensesSection";
import UpcomingEventsCard from "./UpcomingEventsCard";
import NotificationsCard from "./NotificationsCard";
import MonthlySummary from "./MonthlySummary";

const DashboardComponent = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Please sign in to view your dashboard</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <DashboardHeader />
      
      <div className="mt-6">
        <SummaryCards />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <ExpensesSection />
        </div>
        <div>
          <MonthlySummary />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <UpcomingEventsCard />
        <NotificationsCard />
      </div>
    </div>
  );
};

export default DashboardComponent;
