
import { formatCurrency } from "@/utils/expenseUtils";

interface CategoryProgressBarProps {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  currency: string;
  compact?: boolean;
}

const CategoryProgressBar = ({
  name,
  amount,
  percentage,
  color,
  currency,
  compact = false
}: CategoryProgressBarProps) => {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="capitalize">{name}</span>
        <span className="font-medium">{formatCurrency(amount, currency)}</span>
      </div>
      <div className={`h-${compact ? '1.5' : '2'} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`h-full ${color}`}
          style={{ width: `${Math.max(percentage, 3)}%` }}
        />
      </div>
      {!compact && (
        <div className="text-xs text-gray-500 mt-1">
          {percentage.toFixed(1)}% of total
        </div>
      )}
    </div>
  );
};

export default CategoryProgressBar;
