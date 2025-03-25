
import { isSameDay, addDays } from 'date-fns';
import { Event } from '@/utils/types';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import WeekDayCell from './WeekDayCell';

interface WeekViewProps {
  date: Date;
  events: Event[];
}

const WeekView = ({ date, events }: WeekViewProps) => {
  const { getEventsByDate } = useCalendarEvents(events);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(date, i - date.getDay()));
  
  return (
    <div className="grid grid-cols-7 gap-2 mt-4">
      {weekDays.map((day, index) => (
        <WeekDayCell
          key={index}
          day={day}
          events={getEventsByDate(day)}
          isToday={isSameDay(day, new Date())}
        />
      ))}
    </div>
  );
};

export default WeekView;
