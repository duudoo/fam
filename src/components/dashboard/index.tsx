
import { useAuth } from "@/hooks/useAuth";
import { useChildren } from "@/hooks/children";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import SummaryCards from "./SummaryCards";
import ExpensesSection from "./ExpensesSection";
import UpcomingEventsCard from "./UpcomingEventsCard";
import NotificationsCard from "./NotificationsCard";
import MonthlySummary from "./MonthlySummary";

const DashboardComponent = () => {
  const { user } = useAuth();
  const { data: children = [] } = useChildren();
  
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
          
          {children.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">Child Reports</h3>
                <Link to="/expenses" className="text-sm text-blue-500 flex items-center">
                  All Reports
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-2">
                {children.map(child => (
                  <Link 
                    key={child.id} 
                    to={`/expenses?childId=${child.id}`}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {child.initials || child.name?.charAt(0)}
                      </div>
                      <span className="ml-2">{child.name || 'Child'}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}
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
