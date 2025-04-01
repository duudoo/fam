
import { isSameDay, addDays, format } from 'date-fns';
import { Event } from '@/utils/types';
import WeekDayCell from '../WeekDayCell';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface WeekGridProps {
  date: Date;
  events: Event[];
  onDayClick: (date: Date) => void;
}

const WeekGrid = ({ date, events, onDayClick }: WeekGridProps) => {
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(date, i - date.getDay()));
  const isMobile = useIsMobile();
  
  // For mobile, show a horizontal scrollable view of days
  if (isMobile) {
    return (
      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        <div className="grid grid-flow-col gap-2 min-w-[700px]">
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
                className="min-w-[100px]"
              >
                <WeekDayCell
                  day={day}
                  events={dayEvents}
                  isToday={isSameDay(day, new Date())}
                  onDayClick={onDayClick}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }
  
  // For desktop, use a responsive grid
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
              onDayClick={onDayClick}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default WeekGrid;
