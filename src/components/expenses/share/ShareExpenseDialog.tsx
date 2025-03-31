
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Send, Check, ExternalLink, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Expense } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface ShareExpenseDialogProps {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareExpenseDialog = ({ expense, open, onOpenChange }: ShareExpenseDialogProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  // Generate shareable link for the expense
  const expenseLink = expense ? `${window.location.origin}/expenses/${expense.id}` : "";
  
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
  
  // Handle sharing the expense via the messaging system
  const handleShareViaMessage = async () => {
    if (!expense || !user) {
      toast.error("Cannot share expense: missing data");
      return;
    }
    
    setIsSending(true);
    
    try {
      // The current user is always the sender
      const senderId = user.id;
      
      // For the demo we'll use a valid UUID as the co-parent ID
      // In a real app, this would come from a database query of co-parent relationships
      const coParentId = "02430ec4-1ae7-4b48-9a01-249b5839e461";
      
      // Determine if current user is the expense creator (paidBy)
      const isCurrentUserCreator = expense.paidBy === user.id;
      
      // If current user created the expense, send to co-parent
      // Otherwise, send to the expense creator
      const receiverId = isCurrentUserCreator ? coParentId : expense.paidBy;
      
      console.log("Sending message from", senderId, "to", receiverId);
      
      // Format message text
      const messageText = message || 
        `I've shared an expense with you: ${expense.description} for ${expense.amount}`;
      
      // Add a message to the messages table with correctly formatted data
      const { error } = await supabase.from('messages').insert({
        sender_id: senderId,
        receiver_id: receiverId,
        text: messageText,
        attachments: [
          {
            type: "link",
            url: expenseLink,
            name: `Expense: ${expense.description}`,
            id: `${Date.now()}-expense-attachment` // Add a unique ID for the attachment
          }
        ],
        status: 'sent'
      });
      
      if (error) {
        console.error("Supabase error when sharing expense:", error);
        throw error;
      }
      
      toast.success("Expense shared successfully via message");
      onOpenChange(false);
      
      // Navigate to the communications page to see the message
      navigate("/communications");
    } catch (error) {
      console.error("Error sharing expense via message:", error);
      toast.error("Failed to share expense");
    } finally {
      setIsSending(false);
    }
  };
  
  // Handle viewing the expense details
  const handleViewExpense = () => {
    if (expense) {
      onOpenChange(false);
      navigate(`/expenses?id=${expense.id}`);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Expense</DialogTitle>
          <DialogDescription>
            Share the expense details with your co-parent
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="link" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Copy Link</TabsTrigger>
            <TabsTrigger value="message">Send Message</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-4 py-4">
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
                onClick={() => onOpenChange(false)}
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
          </TabsContent>
          
          <TabsContent value="message" className="space-y-4 py-4">
            <div className="space-y-4">
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
                  onClick={() => onOpenChange(false)}
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareExpenseDialog;
