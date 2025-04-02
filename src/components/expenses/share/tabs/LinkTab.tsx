
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface LinkTabProps {
  expenseLink: string;
  onClose: () => void;
}

const LinkTab = ({ expenseLink, onClose }: LinkTabProps) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(expenseLink);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
    }
  };
  
  return (
    <div className="space-y-4 py-4">
      <div className="flex gap-2">
        <Input 
          value={expenseLink} 
          readOnly 
          className="flex-1"
        />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={copyToClipboard}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      
      <p className="text-sm text-gray-500">
        Share this link with your co-parent. They can view and approve the expense.
      </p>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default LinkTab;
