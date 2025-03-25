
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CalendarNavProps {
  date: Date;
  view: 'month' | 'week';
  setDate: (date: Date) => void;
  toggleView: () => void;
}

const CalendarNav = ({ date, view, setDate, toggleView }: CalendarNavProps) => {
  const goToPreviousPeriod = () => {
    if (view === 'month') {
      const previousMonth = new Date(date);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      setDate(previousMonth);
    } else {
      setDate(addDays(date, -7));
    }
  };
  
  const goToNextPeriod = () => {
    if (view === 'month') {
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setDate(nextMonth);
    } else {
      setDate(addDays(date, 7));
    }
  };
  
  const goToToday = () => {
    setDate(new Date());
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(date, i - date.getDay()));
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold text-famacle-slate">
          {view === 'month' 
            ? format(date, 'MMMM yyyy')
            : `Week of ${format(weekDays[0], 'MMM d')} - ${format(weekDays[6], 'MMM d, yyyy')}`
          }
        </h2>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToPreviousPeriod}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToToday}
          className="h-8"
        >
          Today
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToNextPeriod}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Select
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="p-3 pointer-events-auto"
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleView}
          className="h-8"
        >
          {view === 'month' ? 'Week View' : 'Month View'}
        </Button>
      </div>
    </div>
  );
};

export default CalendarNav;
