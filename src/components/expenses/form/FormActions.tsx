
import { Button } from "@/components/ui/button";
import { Share, Plus, Save } from "lucide-react";

interface FormActionsProps {
  showCancelButton?: boolean;
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  showSaveAndShare?: boolean;
  showSaveAndAddAnother?: boolean;
  isMobile?: boolean; // Added isMobile prop
}

const FormActions = ({ 
  showCancelButton = true, 
  isEditing, 
  isSubmitting, 
  onCancel,
  showSaveAndShare = true,
  showSaveAndAddAnother = true,
  isMobile = false, // Default to false
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
    <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
      {showCancelButton && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      )}
      
      {!isEditing && (
        <div className="flex flex-col sm:flex-row gap-3">
          {showSaveAndAddAnother && (
            <Button
              type="button"
              onClick={() => handleSubmit('saveAndAdd')}
              disabled={isSubmitting}
              variant="outline"
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
            >
              <Share className="w-4 h-4 mr-2" />
              Save & Share
            </Button>
          )}
        </div>
      )}
      
      <Button 
        type="button"
        onClick={() => handleSubmit('save')}
        disabled={isSubmitting}
      >
        <Save className="w-4 h-4 mr-2" />
        {isSubmitting ? 'Saving...' : isEditing ? 'Update Expense' : 'Save Expense'}
      </Button>
    </div>
  );
};

export default FormActions;
