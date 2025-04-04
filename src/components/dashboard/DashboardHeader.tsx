
import { Link } from 'react-router-dom';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onScheduleEvent?: () => void;
}

const DashboardHeader = ({ onScheduleEvent }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-famacle-slate">Dashboard</h1>
      </div>
      <div className="flex items-center gap-3 self-stretch sm:self-auto">
        <Button asChild className="flex-1 sm:flex-auto">
          <Link to="/expenses?newExpense=true">
            <Plus className="w-4 h-4 mr-2" />
            Log Expense
          </Link>
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 sm:flex-auto"
          onClick={onScheduleEvent}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Event
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
