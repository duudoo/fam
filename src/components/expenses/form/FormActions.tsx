
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting: boolean;
  isEditing?: boolean;
}

const FormActions = ({ onCancel, isSubmitting, isEditing = false }: FormActionsProps) => {
  return (
    <div className="flex gap-3 justify-end">
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting 
          ? (isEditing ? "Updating..." : "Adding...") 
          : (isEditing ? "Update Expense" : "Add Expense")
        }
      </Button>
    </div>
  );
};

export default FormActions;
