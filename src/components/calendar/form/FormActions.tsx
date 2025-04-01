
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isPending?: boolean;
  isEditing?: boolean;
}

const FormActions = ({ onCancel, isPending = false, isEditing = false }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isPending}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></div>
            Saving...
          </>
        ) : (
          isEditing ? 'Update Event' : 'Create Event'
        )}
      </Button>
    </div>
  );
};

export default FormActions;
