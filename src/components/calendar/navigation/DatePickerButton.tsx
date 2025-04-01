
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerButtonProps {
  date: Date;
  onDateSelect: (date: Date | undefined) => void;
}

const DatePickerButton = ({ date, onDateSelect }: DatePickerButtonProps) => {
  const [open, setOpen] = useState(false);
  
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      console.log('Date selected from popup:', format(newDate, 'MMMM d, yyyy'));
      onDateSelect(newDate);
      setOpen(false);
    }
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 rounded-full">
          Select
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="end">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="p-3 pointer-events-auto"
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerButton;
