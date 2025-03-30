
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
                const submitBtn = document.createElement('button');
                submitBtn.type = 'submit';
                submitBtn.form = 'expense-form';
                document.body.appendChild(submitBtn);
                submitBtn.click();
                submitBtn.remove();
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
                  const submitBtn = document.createElement('button');
                  submitBtn.type = 'submit';
                  submitBtn.form = 'expense-form';
                  submitBtn.value = 'saveAndAdd';
                  document.body.appendChild(submitBtn);
                  submitBtn.click();
                  submitBtn.remove();
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
                  const submitBtn = document.createElement('button');
                  submitBtn.type = 'submit';
                  submitBtn.form = 'expense-form';
                  submitBtn.value = 'saveAndShare';
                  document.body.appendChild(submitBtn);
                  submitBtn.click();
                  submitBtn.remove();
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
              const submitBtn = document.createElement('button');
              submitBtn.type = 'submit';
              submitBtn.form = 'expense-form';
              document.body.appendChild(submitBtn);
              submitBtn.click();
              submitBtn.remove();
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
                const submitBtn = document.createElement('button');
                submitBtn.type = 'submit';
                submitBtn.form = 'expense-form';
                submitBtn.value = 'saveAndAdd';
                document.body.appendChild(submitBtn);
                submitBtn.click();
                submitBtn.remove();
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
                const submitBtn = document.createElement('button');
                submitBtn.type = 'submit';
                submitBtn.form = 'expense-form';
                submitBtn.value = 'saveAndShare';
                document.body.appendChild(submitBtn);
                submitBtn.click();
                submitBtn.remove();
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
