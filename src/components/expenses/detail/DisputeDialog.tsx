
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
import { Expense } from "@/utils/types";
import { useSendDisputeMessage } from "@/hooks/expenses/useSendDisputeMessage";

interface DisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDisputeSubmit: (note: string) => Promise<void>;
  isProcessing: boolean;
  expense?: Expense;
}

const DisputeDialog = ({ 
  open, 
  onOpenChange, 
  onDisputeSubmit, 
  isProcessing,
  expense
}: DisputeDialogProps) => {
  const [disputeNote, setDisputeNote] = useState("");
  const { sendDisputeMessage, isSending } = useSendDisputeMessage();
  
  const isProcessingAny = isProcessing || isSending;

  const handleSubmit = async () => {
    if (!disputeNote.trim()) {
      toast.error("Please provide a reason for the clarification");
      return;
    }
    
    try {
      await onDisputeSubmit(disputeNote);
      
      // If we have an expense, send the dispute message to communication
      if (expense) {
        await sendDisputeMessage(expense, disputeNote);
      }
      
      setDisputeNote("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting dispute:", error);
      toast.error("Failed to submit clarification request");
    }
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
            disabled={isProcessingAny}
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessingAny}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSubmit}
            disabled={!disputeNote.trim() || isProcessingAny}
          >
            {isProcessingAny ? "Sending..." : "Request Clarification"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeDialog;
