
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';
import CalendarNav from './CalendarNav';

interface CalendarHeaderProps {
  date: Date;
  view: 'month' | 'week';
  handleDateChange: (date: Date) => void;
  toggleView: () => void;
}

const CalendarHeader = ({ date, view, handleDateChange, toggleView }: CalendarHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
      <CalendarNav 
        date={date}
        view={view}
        setDate={handleDateChange}
        toggleView={toggleView}
      />
      
      <Link to="/settings?tab=calendar" className="mt-4 sm:mt-0 sm:ml-4">
        <Button variant="outline" size="sm" className="text-famacle-slate flex items-center gap-1 whitespace-nowrap">
          <LinkIcon size={14} />
          Sync Calendars
        </Button>
      </Link>
    </div>
  );
};

export default CalendarHeader;
