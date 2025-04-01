
import { format, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Event } from '@/utils/types';
import DayCell from '../DayCell';
import { DayContentProps } from 'react-day-picker';
import { cn } from '@/lib/utils';

interface CalendarWrapperProps {
  date: Date;
  events: Event[];
  onDayClick: (date: Date) => void;
  getEventsByDate: (day: Date) => Event[];
}

const CalendarWrapper = ({ date, events, onDayClick, getEventsByDate }: CalendarWrapperProps) => {
  // Helper function to determine if a date has events
  const eventForDate = (day: Date) => {
    return events.some(event => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;
      
      return event.allDay 
        ? isSameDay(eventStartDate, day)
        : isSameDay(eventStartDate, day) || isSameDay(eventEndDate, day);
    });
  };
  
  // Custom day component wrapper that passes our props to DayCell
  const CustomDay = (props: DayContentProps) => {
    return (
      <DayCell
        {...props}
        events={events}
        getEventsByDate={getEventsByDate}
        selectedDate={date}
        onDayClick={onDayClick}
      />
    );
  };
  
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(newDate) => newDate && onDayClick(newDate)}
      className="rounded-md border overflow-hidden"
      modifiers={{
        event: (day) => eventForDate(day),
      }}
      modifiersClassNames={{
        event: "has-event",
      }}
      components={{
        Day: CustomDay,
      }}
    />
  );
};

export default CalendarWrapper;
