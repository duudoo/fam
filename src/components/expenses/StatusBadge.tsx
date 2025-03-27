
import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, X, HelpCircle, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const getStatusIcon = (status: string) => {
  switch(status) {
    case 'approved':
      return <Check className="w-4 h-4 text-green-500" />;
    case 'disputed':
      return <X className="w-4 h-4 text-red-500" />;
    case 'paid':
      return <CreditCard className="w-4 h-4 text-green-500" />;
    case 'pending':
    default:
      return <HelpCircle className="w-4 h-4 text-amber-500" />;
  }
};

export const getStatusColor = (status: string) => {
  switch(status) {
    case 'approved':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'disputed':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'paid':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'pending':
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200';
  }
};

const StatusBadge: FC<StatusBadgeProps> = ({ status, className }) => {
  return (
    <Badge variant="outline" className={cn(getStatusColor(status), className)}>
      <span className="flex items-center gap-1">
        {getStatusIcon(status)}
        <span className="capitalize">{status}</span>
      </span>
    </Badge>
  );
};

export default StatusBadge;
