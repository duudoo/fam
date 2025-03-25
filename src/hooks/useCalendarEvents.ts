
import { parseISO, isWithinInterval, isSameDay } from 'date-fns';
import { Event } from '@/utils/types';

export const useCalendarEvents = (events: Event[]) => {
  const getEventsByDate = (date: Date) => {
    return events.filter(event => {
      const eventStartDate = parseISO(event.startDate);
      const eventEndDate = event.endDate ? parseISO(event.endDate) : eventStartDate;
      
      return event.allDay 
        ? isSameDay(eventStartDate, date)
        : isWithinInterval(date, { start: eventStartDate, end: eventEndDate });
    });
  };
  
  const eventForDate = (date: Date) => {
    const eventsToday = getEventsByDate(date);
    return eventsToday.length > 0;
  };

  return {
    getEventsByDate,
    eventForDate
  };
};
