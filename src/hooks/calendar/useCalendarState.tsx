
import { useState } from 'react';

/**
 * Hook for managing calendar state (selected date, view mode)
 */
export const useCalendarState = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  return {
    selectedDate,
    setSelectedDate,
    view,
    setView
  };
};
