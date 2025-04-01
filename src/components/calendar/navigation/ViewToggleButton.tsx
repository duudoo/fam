
import { Button } from '@/components/ui/button';

interface ViewToggleButtonProps {
  view: 'month' | 'week';
  toggleView: () => void;
}

const ViewToggleButton = ({ view, toggleView }: ViewToggleButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleView}
      className="h-8 bg-famacle-blue-light text-famacle-blue hover:bg-famacle-blue hover:text-white rounded-full"
    >
      {view === 'month' ? 'Week View' : 'Month View'}
    </Button>
  );
};

export default ViewToggleButton;
