
import { Button } from "@/components/ui/button";
import { Share, Plus, Save } from "lucide-react";

interface FormActionsProps {
  showCancelButton?: boolean;
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  showSaveAndShare?: boolean;
  showSaveAndAddAnother?: boolean;
  isMobile?: boolean;
}

const FormActions = ({ 
  showCancelButton = true, 
  isEditing, 
  isSubmitting, 
  onCancel,
  showSaveAndShare = true,
  showSaveAndAddAnother = true,
  isMobile = false,
}: FormActionsProps) => {
  const handleSubmit = (action: 'save' | 'saveAndAdd' | 'saveAndShare') => {
    // Set the form action in the hidden input
    const input = document.getElementById('form-action') as HTMLInputElement;
    if (input) {
      input.value = action;
    }
    
    // Submit the form
    const form = document.getElementById('expense-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-6">
      {/* Save actions are always stacked vertically */}
      <Button 
        type="button"
        onClick={() => handleSubmit('save')}
        disabled={isSubmitting}
        className="w-full"
      >
        <Save className="w-4 h-4 mr-2" />
        {isSubmitting ? 'Saving...' : isEditing ? 'Update Expense' : 'Save Expense'}
      </Button>
      
      {!isEditing && (
        <>
          {showSaveAndAddAnother && (
            <Button
              type="button"
              onClick={() => handleSubmit('saveAndAdd')}
              disabled={isSubmitting}
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Save & Add Another
            </Button>
          )}
          
          {showSaveAndShare && (
            <Button
              type="button"
              onClick={() => handleSubmit('saveAndShare')}
              disabled={isSubmitting}
              variant="outline"
              className="w-full"
            >
              <Share className="w-4 h-4 mr-2" />
              Save & Share
            </Button>
          )}
        </>
      )}
      
      {showCancelButton && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full"
        >
          Cancel
        </Button>
      )}
    </div>
  );
};

export default FormActions;
