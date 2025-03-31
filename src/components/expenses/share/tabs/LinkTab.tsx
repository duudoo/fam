
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface LinkTabProps {
  expenseLink: string;
  onClose: () => void;
}

const LinkTab = ({ expenseLink, onClose }: LinkTabProps) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  // Handle copying the expense link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(expenseLink);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast.error("Failed to copy link");
      console.error("Failed to copy:", err);
    }
  };
  
  // Handle viewing the expense details
  const handleViewExpense = () => {
    if (expenseLink) {
      onClose();
      const expenseId = expenseLink.split('/').pop();
      navigate(`/expenses?id=${expenseId}`);
    }
  };
  
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center space-x-2">
        <Input 
          readOnly 
          value={expenseLink} 
          className="flex-1"
        />
        <Button 
          size="icon" 
          onClick={handleCopyLink} 
          variant="outline"
          aria-label="Copy link"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Close
        </Button>
        <Button 
          onClick={handleViewExpense}
          className="flex items-center"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Expense
        </Button>
      </div>
    </div>
  );
};

export default LinkTab;
