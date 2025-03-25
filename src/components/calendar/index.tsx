
import { useState } from 'react';
import CalendarNav from './CalendarNav';
import MonthView from './MonthView';
import WeekView from './WeekView';
import AddEventCard from './AddEventCard';
import { mockEvents } from '@/utils/mockData';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';

const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const events = mockEvents;

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
          events={events}
        />
      ) : (
        <WeekView 
          date={date}
          events={events}
        />
      )}
      
      <AddEventCard />
    </div>
  );
};

export default CalendarView;
