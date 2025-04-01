
import { motion } from 'framer-motion';
import MonthView from './MonthView';
import WeekView from './WeekView';
import { Event } from '@/utils/types';

interface CalendarViewWrapperProps {
  view: 'month' | 'week';
  date: Date;
  events: Event[];
  isLoading: boolean;
  showDayEvents: boolean;
  onDayClick: (date: Date) => void;
  onAddEvent: () => void;
  onResetDaySelection: () => void;
}

const CalendarViewWrapper = ({
  view,
  date,
  events,
  isLoading,
  showDayEvents,
  onDayClick,
  onAddEvent,
  onResetDaySelection
}: CalendarViewWrapperProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-famacle-slate animate-spin h-8 w-8 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <motion.div
      key={`calendar-${view}-${date.toISOString()}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="mt-4"
    >
      {view === 'month' ? (
        <MonthView 
          date={date}
          setDate={onDayClick}
          events={events}
          showDayEvents={showDayEvents}
          onAddEvent={onAddEvent}
          onResetDaySelection={onResetDaySelection}
        />
      ) : (
        <WeekView 
          date={date}
          events={events}
          onDayClick={onDayClick}
          onAddEvent={onAddEvent}
          onResetDaySelection={onResetDaySelection}
        />
      )}
    </motion.div>
  );
};

export default CalendarViewWrapper;
