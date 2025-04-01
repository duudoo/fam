
import { getEvents } from './getEvents';
import { createEvent } from './createEvent';
import { updateEvent } from './updateEvent';
import { deleteEvent } from './deleteEvent';
import { syncExternalCalendar } from './syncCalendar';
import { subscribeToEvents } from './subscribeEvents';

export const eventsAPI = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  syncExternalCalendar,
  subscribeToEvents
};

export * from './types';
