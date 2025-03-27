
import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export const getCategoryColor = (category: string) => {
  switch(category) {
    case 'medical':
      return 'bg-famacle-coral-light text-famacle-coral border-famacle-coral/20';
    case 'education':
      return 'bg-famacle-blue-light text-famacle-blue border-famacle-blue/20';
    case 'clothing':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'activities':
      return 'bg-famacle-teal-light text-famacle-teal border-famacle-teal/20';
    case 'food':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const CategoryBadge: FC<CategoryBadgeProps> = ({ category, className }) => {
  return (
    <Badge variant="outline" className={cn(getCategoryColor(category), className)}>
      <span className="flex items-center gap-1">
        <Tag className="w-3 h-3" />
        <span className="capitalize">{category}</span>
      </span>
    </Badge>
  );
};

export default CategoryBadge;
