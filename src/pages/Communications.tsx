
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { MessageConversation } from "@/components/communication/MessageConversation";
import { MessageInput } from "@/components/communication/MessageInput";
import { ConversationHeader } from "@/components/communication/ConversationHeader";
import { Message } from "@/utils/types";

const CommunicationsPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", senderId: "user", text: "Emma has soccer practice this Saturday at 10am. Can you take her?", timestamp: "2:45 PM", status: "sent" },
    { id: "2", senderId: "other", text: "Yes, I can take her. Will pick her up at 9:30am.", timestamp: "3:12 PM", status: "seen" },
    { id: "3", senderId: "user", text: "Great, thanks! She'll have her gear ready.", timestamp: "3:15 PM", status: "sent" },
    { id: "4", senderId: "other", text: "Also, did you schedule her dentist appointment for next month?", timestamp: "3:20 PM", status: "seen" },
    { id: "5", senderId: "user", text: "Yes, it's on the 15th at 4pm. Added it to the shared calendar.", timestamp: "3:22 PM", status: "sent" }
  ]);

  const handleSendMessage = (newMsg: Omit<Message, "id" | "status">) => {
    const message: Message = {
      id: Date.now().toString(),
      status: "sending",
      ...newMsg
    };
    
    setMessages([...messages, message]);
    
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
        </header>
        
        <Card className="p-6 shadow-lg border border-gray-100 relative">
          <ConversationHeader recipient="Sarah Johnson" />

          <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto mb-4 pr-2">
              <MessageConversation messages={messages} />
            </div>
            
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CommunicationsPage;
