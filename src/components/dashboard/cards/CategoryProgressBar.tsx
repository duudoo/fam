
import { Progress } from '@/components/ui/progress';

export interface CategoryProgressBarProps {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

const CategoryProgressBar = ({ name, amount, percentage, color }: CategoryProgressBarProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
        <span className="text-sm font-medium">{name}</span>
      </div>
      <span className="text-sm font-medium">${amount.toFixed(2)}</span>
    </div>
    <Progress value={percentage} className="h-2 bg-gray-100" />
  </div>
);

export default CategoryProgressBar;
