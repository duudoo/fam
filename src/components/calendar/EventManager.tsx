
import { useCallback } from 'react';
import { Event } from '@/utils/types';
import useAuth from '@/hooks/useAuth';

interface EventManagerProps {
  createEvent: (event: any, userId: string) => void;
  isPending: boolean;
}

const EventManager = ({ createEvent, isPending }: EventManagerProps) => {
  const { user } = useAuth();

  const handleCreateEvent = useCallback((formData: any) => {
    if (!user?.id) {
      console.error("User ID not found");
      return;
    }
    
    // Calculate start and end dates based on form data
    const startDate = new Date(
      formData.date.getFullYear(),
      formData.date.getMonth(),
      formData.date.getDate(),
      formData.allDay ? 0 : parseInt(formData.startTime.split(':')[0]),
      formData.allDay ? 0 : parseInt(formData.startTime.split(':')[1])
    );
    
    const endDate = formData.allDay 
      ? null 
      : new Date(
          formData.date.getFullYear(),
          formData.date.getMonth(),
          formData.date.getDate(),
          parseInt(formData.endTime.split(':')[0]),
          parseInt(formData.endTime.split(':')[1])
        );
    
    // Prepare reminders if enabled
    const reminders = [];
    if (formData.reminder) {
      const reminderMinutes = parseInt(formData.reminderTime);
      const reminderTime = new Date(startDate.getTime() - (reminderMinutes * 60 * 1000));
      
      reminders.push({
        id: '', // Will be generated by backend
        time: reminderTime.toISOString(),
        type: formData.reminderType,
        sent: false
      });
    }
    
    const newEvent = {
      title: formData.title,
      description: formData.description,
      startDate: startDate.toISOString(),
      endDate: endDate ? endDate.toISOString() : null,
      allDay: formData.allDay,
      location: formData.location,
      priority: formData.priority,
      recurring: formData.isRecurring ? {
        type: formData.recurrenceType,
        endsOn: formData.recurrenceEndsOn ? formData.recurrenceEndsOn.toISOString() : null
      } : null,
      reminders: reminders
    };

    createEvent(newEvent, user.id);
    return true;
  }, [createEvent, user]);

  return { handleCreateEvent, isPending };
};

export default EventManager;
