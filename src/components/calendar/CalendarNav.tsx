
import { format, addDays, addMonths, subMonths, subDays, endOfWeek } from 'date-fns';
import { useState } from 'react';
import DateDisplay from './navigation/DateDisplay';
import NavigationButtons from './navigation/NavigationButtons';
import DatePickerButton from './navigation/DatePickerButton';
import ViewToggleButton from './navigation/ViewToggleButton';

interface CalendarNavProps {
  date: Date;
  view: 'month' | 'week';
  setDate: (date: Date) => void;
  toggleView: () => void;
}

const CalendarNav = ({ date, view, setDate, toggleView }: CalendarNavProps) => {
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
      setDate(newDate);
    }
  };
  
  return (
    <div className="flex flex-col justify-between items-start gap-4">
      <div className="flex items-center w-full justify-between">
        <DateDisplay date={date} view={view} />
        
        {view === 'month' && (
          <div className="flex flex-wrap items-center gap-2">
            <NavigationButtons 
              onPrevious={goToPreviousPeriod}
              onNext={goToNextPeriod}
              onToday={goToToday}
            />
            
            <DatePickerButton 
              date={date}
              onDateSelect={handleDateSelect}
            />
            
            <ViewToggleButton 
              view={view}
              toggleView={toggleView}
            />
          </div>
        )}
      </div>
      
      {view === 'week' && (
        <div className="flex flex-wrap items-center gap-2 w-full justify-end">
          <NavigationButtons 
            onPrevious={goToPreviousPeriod}
            onNext={goToNextPeriod}
            onToday={goToToday}
          />
          
          <DatePickerButton 
            date={date}
            onDateSelect={handleDateSelect}
          />
          
          <ViewToggleButton 
            view={view}
            toggleView={toggleView}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarNav;
