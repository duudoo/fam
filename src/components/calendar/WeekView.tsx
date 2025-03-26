
import { isSameDay, addDays } from 'date-fns';
import { Event } from '@/utils/types';
import WeekDayCell from './WeekDayCell';

interface WeekViewProps {
  date: Date;
  events: Event[];
}

const WeekView = ({ date, events }: WeekViewProps) => {
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(date, i - date.getDay()));
  
  return (
    <div className="grid grid-cols-7 gap-2 mt-4">
      {weekDays.map((day, index) => {
        const dayEvents = events.filter(event => {
          const eventStartDate = new Date(event.startDate);
          const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;
          
          return event.allDay 
            ? isSameDay(eventStartDate, day)
            : isSameDay(eventStartDate, day) || isSameDay(eventEndDate, day);
        });
        
        return (
          <WeekDayCell
            key={index}
            day={day}
            events={dayEvents}
            isToday={isSameDay(day, new Date())}
          />
        );
      })}
    </div>
  );
};

export default WeekView;
