
import { format, endOfWeek } from 'date-fns';
import { CalendarClock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DateDisplayProps {
  date: Date;
  view: 'month' | 'week';
}

const DateDisplay = ({ date, view }: DateDisplayProps) => {
  const isMobile = useIsMobile();
  
  // Calculate week range for display
  const getWeekRange = () => {
    const startOfWeek = date;
    const weekEnd = endOfWeek(date);
    // On mobile use shorter month format for week view
    return isMobile 
      ? `${format(startOfWeek, 'MMM d')} - ${format(weekEnd, 'MMM d')}`
      : `${format(startOfWeek, 'MMMM d')} - ${format(weekEnd, 'MMMM d')}`;
  };
  
  return (
    <div className="flex items-center">
      <h2 className="text-xl font-semibold text-famacle-slate mr-2 truncate">
        {view === 'month' 
          ? (isMobile ? format(date, 'MMM yyyy') : format(date, 'MMMM yyyy'))
          : getWeekRange()
        }
      </h2>
      {view === 'week' && (
        <CalendarClock className="h-5 w-5 text-famacle-blue flex-shrink-0" />
      )}
    </div>
  );
};

export default DateDisplay;
