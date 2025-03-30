
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Share, Plus, Save } from "lucide-react";

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
      <div className="flex flex-col gap-3 mt-6">
        <Button 
          type="submit" 
          form="expense-form"
          disabled={isSubmitting}
          className="w-full"
        >
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? "Update Expense" : "Save Expense"}
        </Button>
        
        {showSaveAndShare && (
          <Button 
            type="submit" 
            value="saveAndShare" 
            form="expense-form"
            disabled={isSubmitting}
            variant="outline"
            className="w-full"
          >
            <Share className="mr-2 h-4 w-4" />
            Save & Share
          </Button>
        )}
        
        {showSaveAndAddAnother && (
          <Button 
            type="submit" 
            value="saveAndAdd" 
            form="expense-form"
            disabled={isSubmitting}
            variant="outline"
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Save & Add Another
          </Button>
        )}
        
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
    <div className="flex justify-end gap-3 mt-6">
      <Button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        variant="ghost"
      >
        Cancel
      </Button>
      
      {showSaveAndAddAnother && (
        <Button 
          type="submit" 
          value="saveAndAdd" 
          form="expense-form"
          disabled={isSubmitting}
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          Save & Add Another
        </Button>
      )}
      
      {showSaveAndShare && (
        <Button 
          type="submit" 
          value="saveAndShare" 
          form="expense-form"
          disabled={isSubmitting}
          variant="outline"
        >
          <Share className="mr-2 h-4 w-4" />
          Save & Share
        </Button>
      )}
      
      <Button 
        type="submit" 
        form="expense-form"
        disabled={isSubmitting}
      >
        {isEditing ? "Update Expense" : "Save Expense"}
      </Button>
    </div>
  );
};

export default FormActions;
