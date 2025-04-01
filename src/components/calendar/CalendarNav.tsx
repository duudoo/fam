import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, CalendarIcon, CalendarDays, CalendarClock } from 'lucide-react';
import { format, addDays, addMonths, subMonths, subDays } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from 'react';

interface CalendarNavProps {
  date: Date;
  view: 'month' | 'week';
  setDate: (date: Date) => void;
  toggleView: () => void;
}

const CalendarNav = ({ date, view, setDate, toggleView }: CalendarNavProps) => {
  const [open, setOpen] = useState(false);

  const goToPreviousPeriod = () => {
    if (view === 'month') {
      const newDate = subMonths(date, 1);
      console.log('Previous month:', format(newDate, 'MMMM yyyy'));
      setDate(newDate);
    } else {
      const newDate = subDays(date, 7);
      console.log('Previous week:', format(newDate, 'MMM d, yyyy'));
      setDate(newDate);
    }
  };
  
  const goToNextPeriod = () => {
    if (view === 'month') {
      const newDate = addMonths(date, 1);
      console.log('Next month:', format(newDate, 'MMMM yyyy'));
      setDate(newDate);
    } else {
      const newDate = addDays(date, 7);
      console.log('Next week:', format(newDate, 'MMM d, yyyy'));
      setDate(newDate);
    }
  };
  
  const goToToday = () => {
    const today = new Date();
    console.log('Going to today:', format(today, 'MMMM yyyy'));
    setDate(today);
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      console.log('Date selected from popup:', format(newDate, 'MMMM d, yyyy'));
      setDate(newDate);
      setOpen(false);
    }
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(date, i - date.getDay()));
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-famacle-slate mr-2">
          {view === 'month' 
            ? format(date, 'MMMM yyyy')
            : `${format(weekDays[0], 'MMM d')} - ${format(weekDays[6], 'MMM d, yyyy')}`
          }
        </h2>
        {view === 'month' ? (
          <CalendarDays className="h-5 w-5 text-famacle-blue" />
        ) : (
          <CalendarClock className="h-5 w-5 text-famacle-blue" />
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToPreviousPeriod}
          className="h-8 w-8 p-0 rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToToday}
          className="h-8 rounded-full"
        >
          Today
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToNextPeriod}
          className="h-8 w-8 p-0 rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 rounded-full">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Select
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="p-3 pointer-events-auto"
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleView}
          className="h-8 bg-famacle-blue-light text-famacle-blue hover:bg-famacle-blue hover:text-white rounded-full"
        >
          {view === 'month' ? 'Week View' : 'Month View'}
        </Button>
      </div>
    </div>
  );
};

export default CalendarNav;
