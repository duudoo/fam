
import { Button } from "@/components/ui/button";
import { Share, Plus, Save, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
  showSaveAndShare?: boolean;
  showSaveAndAddAnother?: boolean;
  isMobile?: boolean;
}

const FormActions = ({
  onCancel,
  isSubmitting,
  isEditing,
  showSaveAndShare = false,
  showSaveAndAddAnother = false,
  isMobile = false
}: FormActionsProps) => {
  // Helper function to programmatically submit the form with a specific action
  const submitFormWithAction = (action?: string) => {
    const form = document.getElementById('expense-form') as HTMLFormElement;
    if (!form) return;
    
    // Create a hidden input for the action if provided
    if (action) {
      let actionInput = document.getElementById('form-action') as HTMLInputElement;
      if (!actionInput) {
        actionInput = document.createElement('input');
        actionInput.type = 'hidden';
        actionInput.id = 'form-action';
        actionInput.name = 'form-action';
        form.appendChild(actionInput);
      }
      actionInput.value = action;
    }
    
    form.requestSubmit();
    
    // Clean up the action input after submission
    if (action) {
      setTimeout(() => {
        const actionInput = document.getElementById('form-action');
        if (actionInput) actionInput.remove();
      }, 100);
    }
  };
  
  if (isMobile) {
    return (
      <div className="flex flex-col gap-3 mt-6 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className="w-full justify-between"
              disabled={isSubmitting}
            >
              <div className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update Expense" : "Save Expense"}
              </div>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem 
              className="cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                submitFormWithAction();
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </DropdownMenuItem>
            
            {showSaveAndAddAnother && (
              <DropdownMenuItem 
                className="cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  submitFormWithAction('saveAndAdd');
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Save & Add Another
              </DropdownMenuItem>
            )}
            
            {showSaveAndShare && (
              <DropdownMenuItem 
                className="cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  submitFormWithAction('saveAndShare');
                }}
              >
                <Share className="mr-2 h-4 w-4" />
                Save & Share
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          variant="ghost"
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex justify-end gap-3 mt-6 mb-4">
      <Button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        variant="ghost"
      >
        Cancel
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={isSubmitting}>
            <div className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Update Expense" : "Save Expense"}
            </div>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem 
            className="cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              submitFormWithAction();
            }}
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </DropdownMenuItem>
          
          {showSaveAndAddAnother && (
            <DropdownMenuItem 
              className="cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                submitFormWithAction('saveAndAdd');
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Save & Add Another
            </DropdownMenuItem>
          )}
          
          {showSaveAndShare && (
            <DropdownMenuItem 
              className="cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                submitFormWithAction('saveAndShare');
              }}
            >
              <Share className="mr-2 h-4 w-4" />
              Save & Share
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FormActions;
