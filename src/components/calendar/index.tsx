
import { useState } from 'react';
import CalendarNav from './CalendarNav';
import MonthView from './MonthView';
import WeekView from './WeekView';
import AddEventCard from './AddEventCard';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';

const CalendarView = () => {
  const { 
    events, 
    selectedDate,
    setSelectedDate,
    view,
    setView,
    isLoading
  } = useCalendarEvents();

  const toggleView = () => {
    setView(view === 'month' ? 'week' : 'month');
  };
  
  return (
    <div className="space-y-4 animate-fade-in">
      <CalendarNav 
        date={selectedDate}
        view={view}
        setDate={setSelectedDate}
        toggleView={toggleView}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-famacle-slate animate-spin h-8 w-8 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
        </div>
      ) : view === 'month' ? (
        <MonthView 
          date={selectedDate}
          setDate={setSelectedDate}
          events={events}
        />
      ) : (
        <WeekView 
          date={selectedDate}
          events={events}
        />
      )}
      
      <AddEventCard />
    </div>
  );
};

export default CalendarView;
