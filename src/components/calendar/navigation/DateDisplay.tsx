
import { format, endOfWeek } from 'date-fns';
import { CalendarDays, CalendarClock } from 'lucide-react';

interface DateDisplayProps {
  date: Date;
  view: 'month' | 'week';
}

const DateDisplay = ({ date, view }: DateDisplayProps) => {
  // Calculate week range for display
  const getWeekRange = () => {
    const startOfWeek = date;
    const weekEnd = endOfWeek(date);
    return `${format(startOfWeek, 'MMMM d')} - ${format(weekEnd, 'MMMM d')}`;
  };
  
  return (
    <div className="flex items-center">
      <h2 className="text-xl font-semibold text-famacle-slate mr-2">
        {view === 'month' 
          ? format(date, 'MMMM yyyy')
          : getWeekRange()
        }
      </h2>
      {view === 'month' && (
        <CalendarDays className="h-5 w-5 text-famacle-blue" />
      )}
    </div>
  );
};

export default DateDisplay;
