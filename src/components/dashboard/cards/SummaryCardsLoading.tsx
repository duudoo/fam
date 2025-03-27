
import { Card } from '@/components/ui/card';

const SummaryCardsLoading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="h-32 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
      </Card>
      <Card className="h-32 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
      </Card>
      <Card className="h-32 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
      </Card>
    </div>
  );
};

export default SummaryCardsLoading;
