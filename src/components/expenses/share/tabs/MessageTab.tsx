
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";
import { Expense } from "@/utils/types";
import { useShareExpense } from "@/hooks/expenses/useShareExpense";

interface MessageTabProps {
  expense: Expense | null;
  expenseLink: string;
  onClose: () => void;
}

const MessageTab = ({ expense, expenseLink, onClose }: MessageTabProps) => {
  const [message, setMessage] = useState("");
  const { isSending, shareViaMessage } = useShareExpense({
    expense,
    expenseLink,
    onSuccess: () => {
      setMessage("");
      onClose();
    }
  });
  
  const handleShareViaMessage = async () => {
    if (!expense) {
      console.error("No expense to share");
      return;
    }
    
    // Ensure childIds is always an array, even if empty
    const safeExpense = {
      ...expense,
      childIds: expense.childIds || []
    };
    
    try {
      await shareViaMessage(message);
    } catch (error) {
      console.error("Error sharing expense via message:", error);
    }
  };
  
  return (
    <div className="space-y-4 py-4">
      <Textarea
        placeholder="Add a message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
      />
      
      <p className="text-sm text-gray-500">
        Expense link will be automatically included in your message.
      </p>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleShareViaMessage}
          disabled={isSending}
          className="flex items-center"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          {isSending ? "Sending..." : "Send via Message"}
        </Button>
      </div>
    </div>
  );
};

export default MessageTab;
