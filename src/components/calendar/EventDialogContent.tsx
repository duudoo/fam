
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import EventForm from './EventForm';
import { FormValues } from './form/EventFormSchema';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventDialogContentProps {
  isEditing: boolean;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isPending: boolean;
  initialValues?: FormValues;
  inDrawer?: boolean;
}

const EventDialogContent = ({ 
  isEditing,
  onSubmit, 
  onCancel, 
  isPending,
  initialValues,
  inDrawer = false
}: EventDialogContentProps) => {
  const isMobile = useIsMobile();
  
  const title = isEditing ? 'Edit Event' : 'Create New Event';
  const description = isEditing 
    ? 'Update the details of your calendar event.' 
    : 'Fill in the details below to add a new event to your calendar.';
  
  if (inDrawer) {
    return (
      <DrawerContent className="px-4 pb-6 pt-2">
        <DrawerHeader className="pb-0">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-1 pt-2">
          <EventForm 
            onSubmit={onSubmit}
            onCancel={onCancel}
            isPending={isPending}
            initialValues={initialValues}
          />
        </div>
      </DrawerContent>
    );
  }
  
  return (
    <DialogContent className={`${isMobile ? 'sm:max-w-[90%] p-4' : 'sm:max-w-[600px] p-6'} max-h-[90vh] overflow-y-auto`}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {description}
        </DialogDescription>
      </DialogHeader>
      <EventForm 
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        initialValues={initialValues}
      />
    </DialogContent>
  );
};

export default EventDialogContent;
