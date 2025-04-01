
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

import { formSchema, FormValues, defaultValues } from "./form/EventFormSchema";
import BasicInfoSection from "./form/BasicInfoSection";
import TimeSection from "./form/TimeSection";
import PrioritySection from "./form/PrioritySection";
import LocationSection from "./form/LocationSection";
import RecurringSection from "./form/RecurringSection";
import ReminderSection from "./form/ReminderSection";
import FormActions from "./form/FormActions";

interface EventFormProps {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
  initialValues?: FormValues;
}

const EventForm = ({ 
  onSubmit, 
  onCancel, 
  isPending = false, 
  initialValues 
}: EventFormProps) => {
  const [isAllDay, setIsAllDay] = useState(initialValues?.allDay || false);
  const [isRecurring, setIsRecurring] = useState(initialValues?.isRecurring || false);
  const [hasReminder, setHasReminder] = useState(initialValues?.reminder || false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || defaultValues,
  });

  // Update form UI states when initialValues change
  useEffect(() => {
    if (initialValues) {
      setIsAllDay(initialValues.allDay);
      setIsRecurring(initialValues.isRecurring);
      setHasReminder(initialValues.reminder);
    }
  }, [initialValues]);

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <BasicInfoSection form={form} setIsAllDay={setIsAllDay} />
        
        <TimeSection form={form} isAllDay={isAllDay} />
        
        <PrioritySection form={form} />
        
        <RecurringSection 
          form={form} 
          isRecurring={isRecurring} 
          setIsRecurring={setIsRecurring} 
        />
        
        <ReminderSection 
          form={form} 
          hasReminder={hasReminder} 
          setHasReminder={setHasReminder} 
        />
        
        <LocationSection form={form} />
        
        <FormActions 
          onCancel={onCancel} 
          isPending={isPending} 
          isEditing={!!initialValues} 
        />
      </form>
    </Form>
  );
};

export default EventForm;
