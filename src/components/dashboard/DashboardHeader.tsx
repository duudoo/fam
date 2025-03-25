
import { Link } from 'react-router-dom';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-famacle-slate">Welcome to Famacle</h1>
        <p className="text-gray-500 mt-1">Simplifying co-parenting coordination</p>
      </div>
      <div className="flex items-center gap-3">
        <Button asChild>
          <Link to="/expenses">
            <Plus className="w-4 h-4 mr-2" />
            Log Expense
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/calendar">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Event
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
