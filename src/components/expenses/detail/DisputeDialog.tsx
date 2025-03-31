
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface DisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDisputeSubmit: (note: string) => Promise<void>;
  isProcessing: boolean;
}

const DisputeDialog = ({ 
  open, 
  onOpenChange, 
  onDisputeSubmit, 
  isProcessing 
}: DisputeDialogProps) => {
  const [disputeNote, setDisputeNote] = useState("");

  const handleSubmit = async () => {
    if (!disputeNote.trim()) {
      toast.error("Please provide a reason for the clarification");
      return;
    }
    
    await onDisputeSubmit(disputeNote);
    setDisputeNote("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clarify Expense</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <label className="text-sm font-medium">Reason for clarification</label>
          <Textarea
            className="mt-2"
            placeholder="Please explain why you're requesting clarification for this expense..."
            value={disputeNote}
            onChange={(e) => setDisputeNote(e.target.value)}
            disabled={isProcessing}
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSubmit}
            disabled={!disputeNote.trim() || isProcessing}
          >
            Request Clarification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeDialog;
