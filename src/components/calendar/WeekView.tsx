
import { isSameDay, addDays, format } from 'date-fns';
import { Event } from '@/utils/types';
import WeekDayCell from './WeekDayCell';
import { motion } from 'framer-motion';

interface WeekViewProps {
  date: Date;
  events: Event[];
}

const WeekView = ({ date, events }: WeekViewProps) => {
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(date, i - date.getDay()));
  
  return (
    <div>
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-famacle-slate">
          Week of {format(weekDays[0], 'MMMM d')} to {format(weekDays[6], 'MMMM d, yyyy')}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 mt-4">
        {weekDays.map((day, index) => {
          const dayEvents = events.filter(event => {
            const eventStartDate = new Date(event.startDate);
            const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;
            
            return event.allDay 
              ? isSameDay(eventStartDate, day)
              : isSameDay(eventStartDate, day) || isSameDay(eventEndDate, day);
          });
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <WeekDayCell
                day={day}
                events={dayEvents}
                isToday={isSameDay(day, new Date())}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
