
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Send, MessageCircle, ImagePlus, Paperclip, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import { MessageConversation } from "@/components/communication/MessageConversation";
import { Message } from "@/utils/types";

const CommunicationsPage = () => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", senderId: "user", text: "Emma has soccer practice this Saturday at 10am. Can you take her?", timestamp: "2:45 PM", status: "sent" },
    { id: "2", senderId: "other", text: "Yes, I can take her. Will pick her up at 9:30am.", timestamp: "3:12 PM", status: "seen" },
    { id: "3", senderId: "user", text: "Great, thanks! She'll have her gear ready.", timestamp: "3:15 PM", status: "sent" },
    { id: "4", senderId: "other", text: "Also, did you schedule her dentist appointment for next month?", timestamp: "3:20 PM", status: "seen" },
    { id: "5", senderId: "user", text: "Yes, it's on the 15th at 4pm. Added it to the shared calendar.", timestamp: "3:22 PM", status: "sent" }
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const message: Message = {
      id: Date.now().toString(),
      senderId: "user", 
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sending"
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
    
    // Simulate message being sent
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => m.id === message.id ? {...m, status: "sent"} : m)
      );
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-famacle-blue-light/30">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-famacle-slate mb-2">Communications</h1>
            <p className="text-gray-600">Keep all your co-parenting conversations organized and constructive</p>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
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
        </header>
        
        <Card className="p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="h-6 w-6 text-famacle-blue" />
            <h2 className="text-2xl font-semibold">Sarah Johnson</h2>
          </div>

          <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto mb-4 pr-2">
              <MessageConversation messages={messages} />
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Textarea 
                    placeholder="Type your message here..."
                    className="min-h-[80px] resize-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" title="Attach image">
                    <ImagePlus className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" title="Attach file">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send. Use Shift+Enter for a new line.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CommunicationsPage;
