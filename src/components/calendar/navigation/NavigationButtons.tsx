
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

const NavigationButtons = ({ onPrevious, onNext, onToday }: NavigationButtonsProps) => {
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onPrevious}
        className="h-8 w-8 p-0 rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onToday}
        className="h-8 rounded-full"
      >
        Today
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onNext}
        className="h-8 w-8 p-0 rounded-full"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  );
};

export default NavigationButtons;
