
import { MessageCircle } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConversationHeaderProps {
  recipient: string;
  status?: string;
  email?: string;
}

export const ConversationHeader = ({ recipient, status, email }: ConversationHeaderProps) => {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="h-6 w-6 text-famacle-blue" />
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">{recipient}</h2>
          {status && (
            <Badge variant={status === "accepted" ? "success" : status === "pending" ? "outline" : "destructive"} className="text-xs">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          )}
        </div>
      </div>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="absolute top-6 right-6">
            <Info className="mr-2 h-4 w-4" />
            Communication Tips
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Effective Co-Parenting Communication</SheetTitle>
            <SheetDescription>
              Tips to maintain constructive conversations
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <p className="text-sm">Communication with your co-parent should focus on the needs of your children. Here are some tips for effective communication:</p>
            
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Keep conversations child-focused</li>
              <li>Be brief and to the point</li>
              <li>Stay respectful, even during disagreements</li>
              <li>Use "I" statements instead of "you" accusations</li>
              <li>Document important decisions for future reference</li>
              <li>Respond in a timely manner to important matters</li>
            </ul>
            
            <Alert>
              <AlertTitle>Remember</AlertTitle>
              <AlertDescription>
                All communications in this app are documented and may be referenced in legal proceedings if necessary.
              </AlertDescription>
            </Alert>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
