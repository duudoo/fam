
import { Button } from "@/components/ui/button";
import { Send, Loader2, Save, Plus } from "lucide-react";
import { useExpenseFormContext } from "./ExpenseFormContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting?: boolean;
  isEditing?: boolean;
  showSaveAndShare?: boolean;
  showSaveAndAddAnother?: boolean;
}

const FormActions = ({ 
  onCancel, 
  isSubmitting = false, 
  isEditing = false,
  showSaveAndShare = false,
  showSaveAndAddAnother = false
}: FormActionsProps) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [coParentEmail, setCoParentEmail] = useState("");
  
  const handleSaveAndShare = () => {
    setShareDialogOpen(true);
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
      {onCancel && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      )}
      
      {showSaveAndAddAnother && (
        <Button
          type="submit"
          variant="outline"
          name="action"
          value="saveAndAdd"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Save & Add Another
        </Button>
      )}
      
      {showSaveAndShare && (
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveAndShare}
              disabled={isSubmitting}
            >
              <Send className="mr-2 h-4 w-4" />
              Save & Share
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share with Co-Parent</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-medium">Co-Parent Email</label>
              <Input
                className="mt-1"
                type="email"
                value={coParentEmail}
                onChange={(e) => setCoParentEmail(e.target.value)}
                placeholder="Enter co-parent's email"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShareDialogOpen(false)}>Cancel</Button>
              <Button 
                type="submit"
                name="action"
                value="saveAndShare"
                form="expense-form"
                disabled={!coParentEmail || isSubmitting}
              >
                Share Expense
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      <Button 
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        {isEditing ? "Update Expense" : "Save Expense"}
      </Button>
    </div>
  );
};

export default FormActions;
