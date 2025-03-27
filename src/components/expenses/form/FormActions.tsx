
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting: boolean;
}

const FormActions = ({ onCancel, isSubmitting }: FormActionsProps) => {
  return (
    <div className="flex gap-3 justify-end">
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Expense"}
      </Button>
    </div>
  );
};

export default FormActions;
