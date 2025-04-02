
import { useState, useEffect } from 'react';
import { useChildren } from '@/hooks/children';
import { Check } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';

interface ChildrenSelectionSectionProps {
  defaultSelectedIds?: string[];
}

const ChildrenSelectionSection = ({ defaultSelectedIds = [] }: ChildrenSelectionSectionProps) => {
  const { data: children = [], isLoading } = useChildren();
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelectedIds);
  const form = useFormContext();
  
  useEffect(() => {
    form.setValue('childIds', selectedIds);
  }, [selectedIds, form]);
  
  const toggleChild = (childId: string) => {
    setSelectedIds(prev => 
      prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  };
  
  if (isLoading) {
    return <div className="my-4 animate-pulse h-12 bg-gray-100 rounded-md"></div>;
  }
  
  if (children.length === 0) {
    return (
      <FormField
        control={form.control}
        name="childIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Related Children</FormLabel>
            <div className="text-sm text-gray-500 py-2 border border-dashed border-gray-300 rounded-md p-4 text-center">
              No children added yet. You can add children in the <a href="/user-management" className="text-primary hover:underline">Circle</a> page.
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  
  // If there's only one child, auto-select it
  useEffect(() => {
    if (children.length === 1 && selectedIds.length === 0 && defaultSelectedIds.length === 0) {
      setSelectedIds([children[0].id]);
    }
  }, [children, selectedIds, defaultSelectedIds]);
  
  return (
    <FormField
      control={form.control}
      name="childIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Related Children</FormLabel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {children.map(child => (
              <Button
                key={child.id}
                type="button"
                variant="outline"
                className={cn(
                  "flex items-center justify-between border h-10 px-4 py-2 rounded-md transition-colors",
                  selectedIds.includes(child.id)
                    ? "bg-primary/10 border-primary"
                    : "bg-background hover:bg-primary/5"
                )}
                onClick={() => toggleChild(child.id)}
              >
                <span className="mr-2 font-medium">{child.name || child.initials}</span>
                {selectedIds.includes(child.id) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </Button>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ChildrenSelectionSection;
