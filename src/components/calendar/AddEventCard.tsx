
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from 'lucide-react';
import EventForm from './EventForm';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';

const AddEventCard = () => {
  const [open, setOpen] = useState(false);
  const { createEvent, isPending } = useCalendarEvents();

  const handleCreateEvent = (formData: any) => {
    const newEvent = {
      title: formData.title,
      description: formData.description,
      startDate: new Date(
        formData.date.getFullYear(),
        formData.date.getMonth(),
        formData.date.getDate(),
        formData.allDay ? 0 : parseInt(formData.startTime.split(':')[0]),
        formData.allDay ? 0 : parseInt(formData.startTime.split(':')[1])
      ).toISOString(),
      endDate: formData.allDay 
        ? null 
        : new Date(
            formData.date.getFullYear(),
            formData.date.getMonth(),
            formData.date.getDate(),
            parseInt(formData.endTime.split(':')[0]),
            parseInt(formData.endTime.split(':')[1])
          ).toISOString(),
      allDay: formData.allDay,
      location: formData.location,
      priority: formData.priority
    };

    createEvent(newEvent);
    setOpen(false);
  };

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Add New Event</CardTitle>
          <CardDescription>Schedule a new activity or appointment</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Create new events to keep track of important activities and appointments.
          </p>
          <div className="space-y-2">
            <Badge className="mr-2 bg-famacle-coral text-white">High Priority</Badge>
            <Badge className="mr-2 bg-famacle-blue text-white">Medium Priority</Badge>
            <Badge className="mr-2 bg-famacle-slate-light">Low Priority</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" disabled={isPending}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new event to your calendar.
                </DialogDescription>
              </DialogHeader>
              <EventForm 
                onSubmit={handleCreateEvent}
                onCancel={() => setOpen(false)}
                isPending={isPending}
              />
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </>
  );
};

export default AddEventCard;
