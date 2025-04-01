
import { format } from 'date-fns';

interface SelectedDayHeaderProps {
  selectedDate: Date | null;
}

const SelectedDayHeader = ({ selectedDate }: SelectedDayHeaderProps) => {
  if (!selectedDate) return null;
  
  return (
    <h3 className="text-lg font-medium mb-2 flex items-center text-famacle-slate">
      <span className="bg-white p-1 rounded mr-2 shadow-sm">
        {format(selectedDate, 'd')}
      </span>
      Events for {format(selectedDate, 'MMMM d, yyyy')}
    </h3>
  );
};

export default SelectedDayHeader;
