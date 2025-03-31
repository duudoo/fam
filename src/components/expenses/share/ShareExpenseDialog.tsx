
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Expense } from "@/utils/types";
import LinkTab from "./tabs/LinkTab";
import MessageTab from "./tabs/MessageTab";

interface ShareExpenseDialogProps {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareExpenseDialog = ({ expense, open, onOpenChange }: ShareExpenseDialogProps) => {
  // Generate shareable link for the expense
  const expenseLink = expense ? `${window.location.origin}/expenses/${expense.id}` : "";
  
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
          
          <TabsContent value="link">
            <LinkTab 
              expenseLink={expenseLink} 
              onClose={() => onOpenChange(false)} 
            />
          </TabsContent>
          
          <TabsContent value="message">
            <MessageTab 
              expense={expense} 
              expenseLink={expenseLink}
              onClose={() => onOpenChange(false)} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareExpenseDialog;
