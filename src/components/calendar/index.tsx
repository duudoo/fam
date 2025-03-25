
import { useState } from 'react';
import CalendarNav from './CalendarNav';
import MonthView from './MonthView';
import WeekView from './WeekView';
import AddEventCard from './AddEventCard';
import { mockEvents } from '@/utils/mockData';

const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  
  const toggleView = () => {
    setView(view === 'month' ? 'week' : 'month');
  };
  
  return (
    <div className="space-y-4 animate-fade-in">
      <CalendarNav 
        date={date}
        view={view}
        setDate={setDate}
        toggleView={toggleView}
      />
      
      {view === 'month' ? (
        <MonthView 
          date={date}
          setDate={setDate}
          events={mockEvents}
        />
      ) : (
        <WeekView 
          date={date}
          events={mockEvents}
        />
      )}
      
      <AddEventCard />
    </div>
  );
};

export default CalendarView;
