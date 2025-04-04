
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Save, Plus, Share, ChevronDown } from "lucide-react";

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
    <div className="flex justify-between items-center gap-3 mt-6">
      {/* Cancel button on the left */}
      {showCancelButton && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
      )}
      
      {/* Save Expense dropdown on the right */}
      {isEditing ? (
        // Simple button for editing mode - no dropdown
        <Button 
          type="button"
          onClick={() => handleSubmit('save')}
          disabled={isSubmitting}
          className={showCancelButton ? "flex-1" : "w-full"}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Saving...' : 'Update Expense'}
        </Button>
      ) : (
        // Dropdown for new expense
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className={showCancelButton ? "flex-1" : "w-full"}
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Expense'}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleSubmit('save')}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </DropdownMenuItem>
            
            {showSaveAndAddAnother && (
              <DropdownMenuItem onClick={() => handleSubmit('saveAndAdd')}>
                <Plus className="w-4 h-4 mr-2" />
                Save & Add Another
              </DropdownMenuItem>
            )}
            
            {showSaveAndShare && (
              <DropdownMenuItem onClick={() => handleSubmit('saveAndShare')}>
                <Share className="w-4 h-4 mr-2" />
                Save & Share
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default FormActions;
