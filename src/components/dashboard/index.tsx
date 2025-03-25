
import DashboardHeader from './DashboardHeader';
import SummaryCards from './SummaryCards';
import ExpensesSection from './ExpensesSection';
import MonthlySummary from './MonthlySummary';
import UpcomingEventsCard from './UpcomingEventsCard';
import NotificationsCard from './NotificationsCard';

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardHeader />
      
      {/* Summary Cards */}
      <SummaryCards />
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Expenses Section */}
          <ExpensesSection />
          
          {/* Monthly Summary */}
          <MonthlySummary />
        </div>
        
        <div className="space-y-6">
          {/* Upcoming Events */}
          <UpcomingEventsCard />
          
          {/* Recent Notifications */}
          <NotificationsCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
